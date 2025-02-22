const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const logger = require("../logger"); // Import logger

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  logger.info("Fetching balance", { userId: req.userId });

  const account = await Account.findOne({ userId: req.userId });
  res.json({ balance: account.balance });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  logger.info("Transfer request received", { from: req.userId, to: req.body.to, amount: req.body.amount });

  const session = await mongoose.startSession();
  session.startTransaction();
  const { amount, to } = req.body;

  const account = await Account.findOne({ userId: req.userId }).session(session);
  if (!account || account.balance < amount) {
    await session.abortTransaction();
    logger.warn("Insufficient balance", { userId: req.userId });
    return res.status(400).json({ message: "Insufficient balance" });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);
  if (!toAccount) {
    await session.abortTransaction();
    logger.warn("Invalid account", { to });
    return res.status(400).json({ message: "Invalid account" });
  }

  await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
  await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
  await session.commitTransaction();

  logger.info("Transfer successful", { from: req.userId, to, amount });
  res.json({ message: "Transfer successful" });
});

module.exports = router;
