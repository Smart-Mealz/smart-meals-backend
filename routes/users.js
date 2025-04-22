import { Router } from "express";
import {
  loginUser,
  registerUser,
  verifyUserEmail,
  changeUserRole,
} from "../controllers/users.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

//Create user router
const userRouter = Router();

//Define routes
userRouter.post("/users/register", registerUser);
userRouter.get("/users/verify-email", verifyUserEmail);
userRouter.post("/users/login", loginUser);
userRouter.patch(
  "/users/:id",
  isAuthenticated,
  isAuthorized(["user"]),
  changeUserRole
);

//Export router
export default userRouter;
