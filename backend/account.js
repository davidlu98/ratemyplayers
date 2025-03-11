const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// all routes have prefix /account

router.get("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.decode(token, "LUNA");

    if (user) {
      return res.send(user);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/reviews", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.decode(token, "LUNA");

    if (user) {
      // Return all reviews made by the user
      const allReviews = await prisma.review.findMany({
        where: {
          user_id: user.id,
        },
        include: {
          player: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });
      return res.send(allReviews);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
