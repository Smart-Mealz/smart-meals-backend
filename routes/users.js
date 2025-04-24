import { Router } from "express";
import {
  loginUser,
  registerUser,
  verifyUserEmail,
  forgotUserPassword,
  resetUserPassword,
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
  "/user/:id",
  isAuthenticated,
  // isAuthorized(["user"]),
  changeUserRole
);
userRouter.post("/user/forgot-password", forgotUserPassword);
userRouter.post("/user/reset-password", resetUserPassword);

//Export router
export default userRouter;
