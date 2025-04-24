import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  addMealkitToCart,
  getAllMealkitCarts,
  updateMealkitCart,
  deleteMealkitCart,
} from "../controllers/carts.js";
//Create mealkits router
const cartRouter = Router();

//Define routes
cartRouter.post("/user/cart/:id", isAuthenticated, addMealkitToCart);
cartRouter.get("/user/carts", isAuthenticated, getAllMealkitCarts);
cartRouter.patch("/user/cart/:id", isAuthenticated, updateMealkitCart);
cartRouter.delete("/user/cart/:id", isAuthenticated, deleteMealkitCart);
//Export router
export default cartRouter;
