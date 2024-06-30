const nodemailer = require("nodemailer");
const ErrorResponse = require("../../utils/error");
const sendEmail = async (mailOptions) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return new ErrorResponse("Mail dont send bro", error);
    }
    console.log("Message sent: " + info.messageId);
  });
};

module.exports = sendEmail;
