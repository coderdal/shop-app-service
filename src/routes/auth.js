const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// User signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Make sure you enter your username or password." });
    }

    // Check username and password minimum length
    if (username.length < 3 || password.length < 6) {
      return res.status(400).json({
        error:
          "Username must be at least 3 characters long, and password must be at least 6 characters long.",
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "This username is already taken." });
    }

    // Hash the password and save the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User signup successful." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during user signup." });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Make sure you enter your username or password." });
    }

    // Check username and password minimum length
    if (username.length < 3 || password.length < 6) {
      return res.status(400).json({
        error:
          "Username must be at least 3 characters long, and password must be at least 6 characters long.",
      });
    }

    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Create an access token
    const accessToken = jwt.sign({ userId: user._id }, "jwt_secret_key", {
      expiresIn: "1h",
    });

    // Create a refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      "refresh_token_secret",
      {
        expiresIn: "12h",
      }
    );

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during user login." });
  }
});

// Token renewal
router.get("/refresh-token", authMiddleware, async (req, res) => {
  try {
    // Get the user information
    const user = req.user;

    if (!user) {
      return res
        .status(400)
        .json({ error: "Make sure you enter your username or password." });
    }

    // Create a new JWT and send it to the user
    const newToken = jwt.sign({ userId: user._id }, "jwt_secret_key", {
      expiresIn: "1h",
    });

    // Return the renewed token
    res.status(200).json({ token: newToken });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while refreshing the token." });
  }
});

module.exports = router;
