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
    subject: "Your Hotash OTP Code",
    html: `<h3>Your OTP is: <b>${otp}</b></h3>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
