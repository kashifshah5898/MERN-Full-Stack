import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import errorHandler from "./utils/errorHandler.js";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_URL
    : process.env.PROD_URL;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(function () {
    console.log("mongodb connected");
  })
  .catch((e) => {
    console.log("an error occured", e.message);
  });
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: '*', // Allow requests from any origin
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/client/dist")));

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.get("/api/get-me", (req, res) => {
  res.status(200).json({ success: true, msg: "api is working fine" });
})

/*custom middleware for errors - THIS IS THE NEXT MIDDLEWARE AFTER THE /signup middleware above. Hence next in the authcontroller points to this. R
Remember to always add next as a parameter in your middleware */

app.use("*", (req, res) => {
  //route that doenst match our provided routes
  res.status(400).json({ success: false, msg: "End Point Not Found" })
  // res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("listening on port 3000!");
});
