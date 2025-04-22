import express from "express";
import config from "./utils/config.js";
import mongoose from "mongoose";
import userRouter from "./routes/users.js";
import mealkitsRouter from "./routes/mealkits.js";
import cartRouter from "./routes/carts.js";
import contactRouter from "./routes/contact.js";
import "express-async-errors";

//Make database connection
await mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log("Connected!"));

// Create an express app
const app = express();

//Use global middlewares
app.use(express.json());

//User route
app.use("/api/v1", userRouter);
//Mealkit route
app.use("/api/v1", mealkitsRouter);
//Cart route
app.use("/api/v1", cartRouter);
//Contact route
app.use("/", contactRouter);

const port = config.PORT || 5000;
// Listen for incoming request
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
