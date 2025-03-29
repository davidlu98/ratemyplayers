const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// all routes have prefix /reports

router.get("/", async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        player: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.decode(token, "LUNA");

    if (user) {
      if (req.body.reason.trim() === "") {
        return res.status(400).json("Reason must not be empty.");
      }

      await prisma.report.create({
        data: {
          user_id: user.id,
          review_id: req.body.review_id,
          type: req.body.type,
          reason: req.body.reason.trim(),
        },
      });
      return res.sendStatus(200);
    } else {
      return res.status(401).json("Must be logged in to report a review.");
    }
  } catch (error) {
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
