import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token;
    if (!token) {
      res.status(401).json("You are not authorized to access this");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Your token is invalid");
      req.user = user;
      next();
    });

  } catch (error) {
    res.status(401).json("Inalid Token");
  }
};
