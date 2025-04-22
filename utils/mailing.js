import nodemailer from "nodemailer";
import config from "./config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: config.SMPT_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: config.SMPT_EMAIL,
    pass: config.SMPT_PASSWORD,
  },
});

export const sendEmail = async (mailOptions) => {
  try {
    // send mail with defined transport object
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
