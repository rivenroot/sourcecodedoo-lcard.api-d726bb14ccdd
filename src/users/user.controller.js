const Joi = require('joi');
require('dotenv').config();
const { sendEmail } = require('./helpers/mailer');
const User = require('./user.model');
const { generateJwt } = require('./helpers/generateJwt');

// Validate user schema
const userSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().required().min(4),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  firstName: Joi.string().required().min(2),
  lastName: Joi.string().required().min(2),
  companyName: Joi.string().required().min(2),
  subscriptionType: Joi.string().valid('basic', 'business', 'enterprise').required(),
  payment: Joi.string().valid('annual', 'monthly').required(),
});

exports.Signup = async (req, res) => {
  try {
    const result = userSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }
    // Check if the email has been already registered.
    const user = await User.findOne({
      email: result.value.email,
    });
    if (user) {
      return res.json({
        error: true,
        message: 'Email is already in use',
      });
    }
    const hash = await User.hashPassword(result.value.password);
    // remove the confirmPassword field from the result as we dont need to save this in the db.
    delete result.value.confirmPassword;
    result.value.password = hash;
    const code = Math.floor(100000 + Math.random() * 900000); // Generate random 6 digit code.
    const expiry = Date.now() + 60 * 1000 * 15; // Set expiry 15 mins ahead from now
    const sendCode = await sendEmail(result.value.email, code);
    if (sendCode.error) {
      return res.status(500).json({
        error: true,
        message: 'Couldn\'t send verification email.',
      });
    }
    result.value.emailToken = code;
    result.value.emailTokenExpires = new Date(expiry);
    // const newUser = new User(result.value);

    await User.create(result.value, function(err, usr) {
      if(usr) {
        return res.status(200).json({
          success: true,
          message: 'Registration Success',
        });
      } else {
        return res.status(500).json({
          error: true,
          message: err.message
        })
      }
      
    });
    
  } catch (error) {
    console.error('signup-error', error);
    return res.status(500).json({
      error: true,
      message: 'Cannot Register',
    });
  }
};

exports.Activate = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.json({
        error: true,
        status: 400,
        message: 'Please make a valid request',
      });
    }
    const user = await User.findOne({
      email,
      emailToken: code,
      emailTokenExpires: { $gt: Date.now() }, // check if the code is expired
    });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: 'Invalid details',
      });
    }

    if (user.active) {
      return res.send({
        error: true,
        message: 'User already activated',
        status: 400,
      });
    }

    user.emailToken = '';
    user.emailTokenExpires = null;
    user.active = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'User activated.',
    });
  } catch (error) {
    console.error('activation-error', error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Cannot authorize user.',
      });
    }
    // 1. Find if any user with that email exists in DB
    const user = await User.findOne({ email });
    // NOT FOUND - Throw error
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found',
      });
    }
    // 2. Throw error if user is not activated
    if (!user.active) {
      return res.status(400).json({
        error: true,
        message: 'You must verify your email to activate your user',
      });
    }
    // 3. Verify the password is valid
    const isValid = await User.comparePasswords(password, user.password);
    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: 'Invalid credentials',
      });
    }

    const { error, token } = await generateJwt(user.email, user._id);
    if (error) {
      return res.status(500).json({
        error: true,
        message: 'Couldn\'t create access token. Please try again later',
      });
    }

    user.accessToken = token;

    await user.save();

    // Success
    return res.send({
      success: true,
      message: 'User logged in successfully',
      accessToken: token,
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({
      error: true,
      message: 'Couldn\'t login. Please try again later.',
    });
  }
};

exports.Forgot = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send({
        status: 400,
        error: true,
        message: 'Cannot be processed',
      });
    }
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.send({
        success: true,
        message:
          'If that email address is in our database, we will send you an email to reset your password',
      });
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    const response = await sendEmail(user.email, code);
    if (response.error) {
      return res.status(500).json({
        error: true,
        message: 'Couldn\'t send mail. Please try again later.',
      });
    }
    const expiry = Date.now() + 60 * 1000 * 15;
    user.resetPasswordToken = code;
    user.resetPasswordExpires = expiry; // 15 minutes
    await user.save();
    return res.send({
      success: true,
      message:
        'If that email address is in our database, we will send you an email to reset your password',
    });
  } catch (error) {
    console.error('forgot-password-error', error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.Reset = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    if (!token || !newPassword || !confirmPassword) {
      return res.status(403).json({
        error: true,
        message:
          'Couldn\'t process request. Please provide all mandatory fields',
      });
    }
    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.send({
        error: true,
        message: 'Password reset token is invalid or has expired.',
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: true,
        message: 'Passwords didn\'t match',
      });
    }
    const hash = await User.hashPassword(req.body.newPassword);
    user.password = hash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = '';
    await user.save();
    return res.send({
      success: true,
      message: 'Password has been changed',
    });
  } catch (error) {
    console.error('reset-password-error', error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.Logout = async (req, res) => {
  try {
    const { id } = req.decoded;
    const user = await User.findOne({ _id: id });
    user.accessToken = '';
    await user.save();
    return res.send({ success: true, message: 'User Logged out' });
  } catch (error) {
    console.error('user-logout-error', error);
    return res.stat(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.DeleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany();
    return res.send({ success: true, message: 'All users deleted' });
  } catch (error) {
    console.error('users-delete-error', error);
    return res.stat(500).json({
      error: true,
      message: error.message,
    });
  }
};
