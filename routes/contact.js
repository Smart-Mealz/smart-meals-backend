import { Router } from "express";
import { submitContactForm } from "../controllers/contact.js";

//Create contact router
const contactRouter = Router();

//Define routes
contactRouter.post("/contact", submitContactForm);

//Export router
export default contactRouter;
