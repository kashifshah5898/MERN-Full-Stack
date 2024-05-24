import express from "express";
import {
  GoogleAuthController,
  SignUpController,
  SignInController,
} from "../controllers/auth.controller.js";
import { SignOutController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", SignUpController);
router.post("/signin", SignInController);
router.post("/google", GoogleAuthController);
router.get("/signout", SignOutController);
export default router;
