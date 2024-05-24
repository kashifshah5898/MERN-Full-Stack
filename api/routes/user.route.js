import express from "express";
import {
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const userRouter = express.Router();

userRouter.post("/update/:id", verifyToken, updateUserController);
userRouter.delete("/delete/:id", verifyToken, deleteUserController);

export default userRouter;
