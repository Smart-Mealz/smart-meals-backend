import { Router } from "express";
import { mealkitImageUpload } from "../middlewares/upload.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  addMealkit,
  deleteMealkit,
  getAllMealkits,
  getMealkit,
  updateMealkit,
  updateMealkitImage,
} from "../controllers/mealkits.js";
//Create mealkits router
const mealkitsRouter = Router();

//Define routes
mealkitsRouter.post(
  "/mealkits",
  isAuthenticated,
  isAuthorized(["admin"]),
  mealkitImageUpload.single("image"),
  addMealkit
);

mealkitsRouter.get(
  "/mealkits",
  isAuthenticated,
  isAuthorized(["admin"]),
  getAllMealkits
);

mealkitsRouter.get(
  "/mealkit/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  getMealkit
);

mealkitsRouter.get(
  "/mealkits",
  isAuthenticated,
  isAuthorized(["admin"]),
  getAllMealkits
);

mealkitsRouter.delete(
  "/mealkit/admin/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  deleteMealkit
);

mealkitsRouter.put(
  "/mealkit/admin/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  updateMealkit
);

mealkitsRouter.patch(
  "/mealkit/admin/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  mealkitImageUpload.single("image"),
  updateMealkitImage
);

//Export router
export default mealkitsRouter;
