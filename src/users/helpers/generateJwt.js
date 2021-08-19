const jwt = require('jsonwebtoken');
require('dotenv').config();

const options = {
  expiresIn: '7d',
};
async function generateJwt(email, userId) {
  try {
    const payload = { email, id: userId };
    const token = jwt.sign(payload, 'JwtToken', options);
    return { error: false, token };
  } catch (error) {
    return { error: true };
  }
}
module.exports = { generateJwt };
