require('dotenv').config();
const sgMail = require('@sendgrid/mail');

async function sendEmail(email, code) {
  sgMail.setApiKey(process.env.SG_APIKEY);
  const msg = {
    to: email,
    from: 'vldmr.timotijevic@gmail.com',
    subject: 'Verify your email',
    html: `<!DOCTYPE> 
        <html>
          <body>
            <p>Your authentication code is : </p> <b>${code}</b>
          </body>
        </html>`,
  };
  try {
    await sgMail.send(msg);
    return { error: false };
  } catch (error) {
    return { error: true, message: 'Cannot send email' };
  }
}
module.exports = { sendEmail };
