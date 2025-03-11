const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// all routes have prefix /login

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      res.sendStatus(401);
    } else {
      const isCorrectPassword = bcrypt.compareSync(password, user.password);

      if (isCorrectPassword) {
        const token = jwt.sign(user, "LUNA");
        res.send(token);
      } else {
        res.sendStatus(401);
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
