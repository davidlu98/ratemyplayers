const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// all routes have prefix /reviews

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

router.get("/:reviewId/votes", async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const upvotes = await prisma.vote.count({
      where: { review_id: reviewId, value: 1 },
    });
    const downvotes = await prisma.vote.count({
      where: { review_id: reviewId, value: -1 },
    });

    res.send({ upvotes: upvotes, downvotes: downvotes });
  } catch (error) {
    next(error);
  }
});

router.get("/:player_id", async (req, res, next) => {
  const { player_id } = req.params;
  const { sortBy, rating } = req.query;

  let orderBy = { created_at: "desc" }; // By default, Newest first
  if (sortBy === "oldest") orderBy = { created_at: "asc" };
  if (sortBy === "most_upvotes")
    orderBy = [{ upvotes: "desc" }, { created_at: "desc" }];
  if (sortBy === "most_downvotes")
    orderBy = [{ downvotes: "desc" }, { created_at: "desc" }];

  let where = { player_id };
  if (rating !== "all") {
    where = { player_id, rating: parseInt(rating) };
  }

  try {
    const reviews = await prisma.review.findMany({
      where,
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
      orderBy,
    });

    const sanitizedReviews = reviews.map((review) => ({
      ...review,
      user: review.anonymous ? null : review.user,
    }));

    res.send(sanitizedReviews);
  } catch (error) {
    res.send(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.decode(token, "LUNA");

    if (user) {
      if (req.body.comment.trim() === "") {
        return res.status(400).json("Review must not be empty.");
      }

      await prisma.review.create({
        data: {
          user_id: user.id,
          player_id: req.body.player_id,
          rating: Number(req.body.rating),
          comment: req.body.comment.trim(),
          anonymous: req.body.anonymous,
        },
      });
      return res.sendStatus(200);
    } else {
      return res.status(401).json("Must be logged in to submit a review.");
    }
  } catch (error) {
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.decode(token, "LUNA");

    if (user) {
      await prisma.review.delete({
        where: {
          id: req.params.id,
        },
      });
      return res.sendStatus(204);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
