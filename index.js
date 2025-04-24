import express from "express";
import config from "./utils/config.js";
import mongoose from "mongoose";
import userRouter from "./routes/users.js";
import mealkitsRouter from "./routes/mealkits.js";
import cartRouter from "./routes/carts.js";
import contactRouter from "./routes/contact.js";
import { submitOrder } from "./controllers/orders.js";
import "express-async-errors";
import cors from "cors";
import orderRouter from "./routes/orders.js";

//Make database connection
await mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log("Connected!"));

// Create an express app
const app = express();

//Use global middlewares
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://smartmealz.netlify.app"],
    credentials: true,
  })
);

//User route
app.use("/api/v1", userRouter);
//Mealkit route
app.use("/api/v1", mealkitsRouter);
//Cart route
app.use("/api/v1", cartRouter);
//Order route
app.use("/api/v1", orderRouter);
//Contact route
app.use("/", contactRouter);

const port = config.PORT || 5000;
// Listen for incoming request
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
