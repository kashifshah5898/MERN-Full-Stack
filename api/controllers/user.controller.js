import User from "../models/users.model.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/errorHandler.js";

export const updateUserController = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return res
      .status(401)
      .json({ success: false, message: "You can only update your account" });
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          profileImage: req.body.profileImage,
          email: req.body.email,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;

    return res.status(200).json(rest);
  } catch (err) {
    next(errorHandler);
  }
};

export const deleteUserController = async (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return res.status("401").json("You are forbidden to delete this account");
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (e) {
    next(errorHandler);
  }
};
