import { ContactModel } from "../models/contact.js";
import { sendEmail } from "../utils/mailing.js";
import { contactValidator } from "../validators/contact.js";
import config from "../utils/config.js";

export const submitContactForm = async (req, res) => {
  // Validate incoming data
  const { error, value } = contactValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  try {
    // Create a new contact document
    const contact = new ContactModel(value);

    // Save contact to the database
    await contact.save();

    await sendEmail({
      from: config.SMPT_EMAIL,
      to: contact.email,
      subject: "Your message has been received – SmartMeal Support",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            color: #333;
          }
          .email-container {
            max-width: 600px;
            margin: auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #333;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h2>Hello ,</h2>
          <p>Thank you for contacting SmartMeal!</p>
          <p>We have received your message and our team will get back to you as soon as possible.</p>
          <p>We appreciate you reaching out to us.</p>
          <p>Cheers,</p>
          <p>- SmartMeal Team</p>
        </div>
      </body>
      </html>
      `,
    });

    // Respond with success message
    res
      .status(200)
      .json({ message: "Your message has been received. Thank you!" });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
