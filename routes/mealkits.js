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
  "/admin/mealkit/add",
  isAuthenticated,
  // isAuthorized(["admin"]),
  mealkitImageUpload.single("image"),
  addMealkit
);

mealkitsRouter.get(
  "/admin/mealkits",
  // isAuthenticated,
  // isAuthorized(["admin"]),
  getAllMealkits
);

mealkitsRouter.get(
  "/admin/mealkit/:id",
  isAuthenticated,
  // isAuthorized(["admin"]),
  getMealkit
);

// mealkitsRouter.get(
//   "/admin/mealkits",
//   // isAuthenticated,
//   // isAuthorized(["admin"]),
//   getAllMealkits
// );

mealkitsRouter.delete(
  "/admin/mealkit/:id",
  isAuthenticated,
  // isAuthorized(["admin"]),
  deleteMealkit
);

mealkitsRouter.put(
  "/admin/mealkit/:id",
  isAuthenticated,
  // isAuthorized(["admin"]),
  updateMealkit
);

mealkitsRouter.patch(
  "/admin/mealkit/:id",
  isAuthenticated,
  // isAuthorized(["admin"]),
  mealkitImageUpload.single("image"),
  updateMealkitImage
);

//Export router
export default mealkitsRouter;
