const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// all routes have prefix /account

router.get("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) return res.sendStatus(401);

    let user;
    try {
      user = jwt.verify(token, "LUNA");
    } catch (error) {
      return res.status(401).json("Invalid or expired token");
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        username: user.username,
      },
    });

    if (!dbUser) {
      return res.status(404).json("User not found");
    }

    if (dbUser.banned) {
      return res.status(403).json("This account has been banned.");
    }
    return res.send(dbUser);
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
      return res.status(401).json("Error when obtaining reviews.");
    }
  } catch (error) {
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
