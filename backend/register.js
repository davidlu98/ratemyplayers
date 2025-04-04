const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fs = require("fs");
const path = require("path");

const badWordsPath = path.join(__dirname, "badwords.txt");
const badWords = fs
  .readFileSync(badWordsPath, "utf-8")
  .split("\n")
  .map((word) => word.trim().toLowerCase()) // Trim whitespace and standardize case
  .filter((word) => word.length > 0); // Remove empty lines

// all routes have prefix /register

router.post("/", async (req, res, next) => {
  try {
    const { username, password, confirmedPassword } = req.body;

    if (username !== username.trim()) {
      return res
        .status(400)
        .json("Username cannot have leading or trailing spaces.");
    }

    if (username.length < 4 || username.length > 12) {
      return res
        .status(400)
        .json("Username must be between 4 and 12 characters.");
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res
        .status(400)
        .json("Username can only contain letters and numbers.");
    }

    if (badWords.includes(username)) {
      return res.status(400).json("Username is inappropriate.");
    }

    if (password !== confirmedPassword) {
      return res.status(400).json("Passwords are not the same.");
    }

    if (password !== password.trim()) {
      return res
        .status(400)
        .json("Password cannot have leading or trailing spaces.");
    }

    if (password.length < 6 || username.length > 255) {
      return res
        .status(400)
        .json("Password must be at least 6 characters long.");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(newUser, "LUNA");
    return res.send(token);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json("Username is already taken.");
    }
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
