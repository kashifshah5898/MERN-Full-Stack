import User from "../models/users.model.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const SignUpController = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const user = new User({ username, email, password: hashedPassword });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({
        message: "Sorry, we were not able to sign you up",
        success: false,
      });
    }
    await user.save({ username, email, password: hashedPassword });
    res
      .status(201)
      .json({ message: "New User created " + user, success: true });
  } catch (err) {
    next(errorHandler);
  }
};

export const SignInController = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("method: " + req.method);
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Wrong Credentials. Please try again",
        success: false,
      });
    }
    const checkValidity = bcryptjs.compareSync(password, user.password);

    if (!checkValidity) {
      return res.status(404).json({
        message: "Wrong Credentials. Please try again",
        success: false,
      });
    }
    const { password: hashedPassword, ...rest } = user._doc;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const expiryDate = new Date(Date.now() + 3600000);
    return res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (err) {
    next(errorHandler(err));
  }
};

export const GoogleAuthController = async (req, res, next) => {
  const { name, email, photo } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const { password, ...rest } = existingUser._doc;
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
      const expiryDate = new Date(Date.now() + 3600000);
      return res
        .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const user = new User({
        username: name
          .split(" ")
          .join("")
          .toLowerCase()
          .padEnd(20, Math.floor(Math.random() * 10000)),
        email,
        password: hashedPassword,
        profileImage: photo,
      });
      const { password, ...userRest } = user._doc;

      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const expiryDate = new Date(Date.now() + 3600000);
      return res
        .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(userRest);
    }
  } catch (e) {}
};

export const SignOutController = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return;
  res.clearCookie("access_token").status(200).json("User signed out");
};
