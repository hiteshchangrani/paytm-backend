const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middleware");
const logger = require("../logger");

const router = express.Router();

const signupSchema = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  try {
    logger.info("User signup attempt", { username: req.body.username });

    const { success } = signupSchema.safeParse(req.body);
    if (!success) {
      logger.warn("Signup failed: Invalid input", { username: req.body.username });
      return res.status(400).json({ message: "Incorrect inputs" });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      logger.warn("Signup failed: Email already taken", { username: req.body.username });
      return res.status(400).json({ message: "Email already taken" });
    }

    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    await Account.create({ userId: user._id, balance: 1 + Math.random() * 10000 });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    logger.info("User signed up successfully", { userId: user._id });

    res.json({ message: "User created successfully", token });
  } catch (error) {
    logger.error("Signup error", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    logger.info("User signin attempt", { username: req.body.username });

    const { success } = zod.object({ username: zod.string().email(), password: zod.string() }).safeParse(req.body);
    if (!success) {
      logger.warn("Signin failed: Incorrect inputs", { username: req.body.username });
      return res.status(400).json({ message: "Incorrect inputs" });
    }

    const existingUser = await User.findOne({ username: req.body.username, password: req.body.password });
    if (!existingUser) {
      logger.warn("Signin failed: User not found", { username: req.body.username });
      return res.status(400).json({ message: "Error while logging in" });
    }

    const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);
    logger.info("User signed in successfully", { userId: existingUser._id });

    res.json({ token });
  } catch (error) {
    logger.error("Signin error", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
