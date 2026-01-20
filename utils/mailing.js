import config from "./config.js";
import { Resend } from "resend";

const resend = new Resend(config.RESEND_API);

export const sendEmail = async (mailOptions) => {
  try {
    // send mail with defined transport object
    await resend.emails.send(mailOptions);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
