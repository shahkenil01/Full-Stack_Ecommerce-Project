const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendOTPEmail = async (email, otp, type = 'signup') => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;

  const apiKey =
    defaultClient.authentications['api-key'];

  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance =
    new SibApiV3Sdk.TransactionalEmailsApi();

  const subject =
    type === 'reset'
      ? 'Reset Your Password'
      : 'Your OTP Verification Code';

  const htmlContent = `
    <div style="font-family:Arial;padding:20px">
      <h2>Hotash Verification</h2>
      <p>Your OTP:</p>

      <div style="
        font-size:32px;
        font-weight:bold;
        color:#6f42c1;
        letter-spacing:5px;
      ">
        ${otp}
      </div>

      <p>Valid for 5 minutes.</p>
    </div>
  `;

  await apiInstance.sendTransacEmail({
    sender: {
      email: 'kenilshah765@gmail.com',
      name: 'Hotash',
    },

    to: [{ email }],

    subject,

    htmlContent,
  });

  console.log('MAIL SENT');
};

module.exports = sendOTPEmail;