require('dotenv').config();
const sgMail = require('@sendgrid/mail');

async function sendEmail(email, code) {
  sgMail.setApiKey('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');
  const msg = {
    to: email,
    from: 'johnny@startifysolutions.com',
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
