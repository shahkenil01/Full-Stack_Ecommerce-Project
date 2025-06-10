const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Hotash" <${process.env.MAIL_USERNAME}>`,
    to: email,
    subject: "Your Hotash OTP Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0d6efd; padding: 20px; color: white; text-align: center;">
          <h2>Hotash Account Verification</h2>
        </div>
        <div style="padding: 30px; text-align: center;">
          <p style="font-size: 16px;">Hi there 👋,</p>
          <p style="font-size: 16px;">To continue with your registration, please use the OTP below:</p>
          <p style="font-size: 30px; font-weight: bold; color: #0d6efd; margin: 20px 0;">${otp}</p>
          <p style="font-size: 14px; color: #555;">This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #aaa;">If you didn't request this, you can safely ignore this email.</p>
          <p style="font-size: 12px; color: #aaa;">— Hotash Team</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
