import { ContactModel } from "../models/contact.js";

import { contactValidator } from "../validators/contact.js";

export const submitContactForm = async (req, res) => {
  const { error, value } = contactValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  try {
    const contact = new ContactModel(value);
    await contact.save();

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
