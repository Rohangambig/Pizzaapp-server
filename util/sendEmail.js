const nodemailer = require("nodemailer");
const logger = require('./logger');

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: '"PizzaApp 🍕" <pizzariaproject03@gmail.com>',
      to,
      subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    
  } catch (error) {
    logger.error("❌ Error sending email:", error);
  }
};

module.exports = sendEmail;
