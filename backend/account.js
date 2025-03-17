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
      // Find all reviews made by the user
      const allReviews = await prisma.review.findMany({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
          player_id: true,
          rating: true,
          comment: true,
          created_at: true,
          anonymous: true,
          player: true,
          user: {
            select: { username: true },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      // Group reviews by player.current_name
      const groupedReviews = allReviews.reduce((acc, review) => {
        const { current_name, avatar, region, server, level, job } =
          review.player;

        if (!acc[current_name]) {
          acc[current_name] = {
            playerInfo: { current_name, avatar, region, server, level, job },
            reviews: [],
          };
        }

        acc[current_name].reviews.push(review);
        return acc;
      }, {});

      return res.send(groupedReviews);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
