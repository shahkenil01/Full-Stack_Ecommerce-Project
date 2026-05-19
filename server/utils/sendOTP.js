const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp, type = 'signup') => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,

    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },

    tls: {
      rejectUnauthorized: false,
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
  });

  const subject =
    type === 'reset'
      ? 'Reset Your Hotash Password'
      : 'Your Hotash OTP Verification Code';

  const html =
    type === 'reset'
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow:hidden;">
          
          <div style="background-color: #dc3545; padding: 20px; color: white; text-align: center;">
            <h2 style="margin:0;">Reset Your Password</h2>
          </div>

          <div style="padding: 30px; text-align: center;">
            <p style="font-size: 16px;">We received a request to reset your password.</p>

            <p style="font-size: 16px;">Use the OTP below to continue:</p>

            <div style="margin:30px 0;">
              <span style="display:inline-block; background:#f8f9fa; border:2px dashed #dc3545; padding:15px 35px; font-size:32px; font-weight:bold; color:#dc3545; letter-spacing:5px; border-radius:10px;">
                ${otp}
              </span>
            </div>

            <p style="font-size: 14px; color: #555;">
              This OTP is valid for 5 minutes. Do not share it with anyone.
            </p>

            <hr style="margin: 30px 0; border:none; border-top:1px solid #eee;">

            <p style="font-size: 12px; color: #aaa;">
              If you didn’t request this, ignore this email.
            </p>

            <p style="font-size: 12px; color: #aaa;">
              — Hotash Support Team
            </p>
          </div>
        </div>`
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow:hidden;">
          
          <div style="background: linear-gradient(135deg,#0d6efd,#6f42c1); padding: 25px; color: white; text-align: center;">
            <h1 style="margin:0; font-size:28px;">Hotash</h1>
            <p style="margin-top:8px; opacity:0.9;">Account Verification</p>
          </div>

          <div style="padding: 35px; text-align: center; background:#fff;">
            
            <h2 style="margin-top:0; color:#333;">Hi there 👋</h2>

            <p style="font-size: 16px; color:#555; line-height:1.7;">
              To continue with your registration, please use the verification OTP below.
            </p>

            <div style="margin:35px 0;">
              <span style="display:inline-block; background:#f8f9ff; border:2px dashed #0d6efd; padding:16px 40px; font-size:34px; font-weight:bold; color:#0d6efd; letter-spacing:6px; border-radius:12px;">
                ${otp}
              </span>
            </div>

            <p style="font-size: 14px; color: #666;">
              This OTP is valid for <b>5 minutes</b>.
            </p>

            <p style="font-size: 14px; color: #666;">
              Please do not share it with anyone.
            </p>

            <hr style="margin: 35px 0; border:none; border-top:1px solid #eee;">

            <p style="font-size: 12px; color: #999;">
              If you didn't request this, you can safely ignore this email.
            </p>

            <p style="font-size: 12px; color: #999;">
              — Hotash Team
            </p>
          </div>
        </div>`;

  const mailOptions = {
    from: '"Hotash" <kenilshah765@gmail.com>',
    to: email,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('MAIL SENT', info.response);
  } catch (err) {
    console.log('MAIL ERROR', err);
    throw err;
  }
};

module.exports = sendOTPEmail;
