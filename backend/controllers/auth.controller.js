import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({
        error: "Email is not valid",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send({
        error: "Username is already taken",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({
        error: "Email is already taken",
      });
    }

    if (password.length < 6) {
      return res.status(400).send({
        error: "Password must be at least 6 characters",
      });
    }

    // Hash password
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).send({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).send({
        error: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in signup");
    res.status(500).send({
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPasswordValid = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordValid) {
      return res.status(400).send({
        error: "Invalid credentials provided",
      });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).send({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Error in login controller");
    res.status(500).send({
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).send({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout controller");
    res.status(500).send({
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).send({
        error: "User not found on getMe",
      });
    }
    res.status(200).send(user);
  } catch (error) {
    console.log("Error in getMe controller");
    res.status(500).send({
      error: error.message,
    });
  }
};
