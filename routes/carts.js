import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  addMealkitToCart,
  getMealkitCart,
  getAllMealkitCarts,
  updateMealkitCart,
  deleteMealkitCart,
} from "../controllers/carts.js";
//Create mealkits router
const cartRouter = Router();

//Define routes
cartRouter.post("/cart/:id", isAuthenticated, addMealkitToCart);
cartRouter.get("/cart/:id", isAuthenticated, getMealkitCart);
cartRouter.get("/carts", isAuthenticated, getAllMealkitCarts);
cartRouter.patch("/cart/:id", isAuthenticated, updateMealkitCart);
cartRouter.delete("/cart/:id", isAuthenticated, deleteMealkitCart);
//Export router
export default cartRouter;
