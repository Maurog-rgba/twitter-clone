import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send({
        error: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).send({
        error: "Unauthorized: Invalid token",
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).send({
        error: "User not found on protectedRoute",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectedRoute middleware", error.message);
    res.status(500).send({
      error: error.message,
    });
  }
};
// The protectedRoute middleware function is used to protect routes that require a user to be logged in.
// It checks if the request contains a valid JWT token in the Authorization header and then verifies the token using the jwt.verify method.
// If the token is valid, it extracts the user ID from the token payload and fetches the user from the database using the User model.
// The user object is then attached to the request object as req.user, which can be accessed in the route handler functions.
