import { Router } from "express";
import { submitOrder } from "../controllers/orders.js";
import { isAuthenticated } from "../middlewares/auth.js";

const orderRouter = Router();

orderRouter.post("/orders", isAuthenticated, submitOrder);

export default orderRouter;
