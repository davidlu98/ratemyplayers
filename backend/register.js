const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// all routes have prefix /register

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (username.length < 4 || username.length > 12) {
      return res
        .status(400)
        .json("Username must be between 4 and 12 characters.");
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
