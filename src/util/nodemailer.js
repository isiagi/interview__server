import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

import dotenv from "dotenv";

dotenv.config();

const sendEmail = (options) => {
  let transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  );

  let mailOptions = {
    from: "somerealemail@gmail.com",
    to: options.email,
    subject: options.subject,
    html: options.text,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error)
    }else {
        console.log(`Email sent ${info.response}`)
    }
  })

};

export default sendEmail;
