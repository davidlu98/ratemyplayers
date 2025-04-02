const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const MAX_COMMENT_SIZE = 200;

const fs = require("fs");
const path = require("path");

const badWordsPath = path.join(__dirname, "badwords.txt");
const badWords = fs
  .readFileSync(badWordsPath, "utf-8")
  .split("\n")
  .map((word) => word.trim().toLowerCase()) // Trim whitespace and standardize case
  .filter((word) => word.length > 0); // Remove empty lines

const censorText = (text) => {
  const regex = new RegExp(`\\b(${badWords.join("|")})\\b`, "gi");
  return text.replace(regex, (match) => "*".repeat(match.length));
};

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

router.get("/:player_id/all", async (req, res) => {
  const { player_id } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: {
        player_id,
      },
      select: {
        rating: true,
      },
    });

    res.send(reviews);
  } catch (error) {
    res.send(error);
  }
});

router.get("/:player_id", async (req, res) => {
  const { player_id } = req.params;
  const { sortBy, rating } = req.query;

  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;

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
    const totalReviews = await prisma.review.count({
      where,
    });

    const reviews = await prisma.review.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
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

    res.json({
      reviews: sanitizedReviews,
      totalPages: Math.ceil(totalReviews / pageSize),
      totalReviews,
    });
  } catch (error) {
    res.send(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.decode(token, "LUNA");

    if (user) {
      const comment = req.body.comment.trim();
      const regex = /^[a-zA-Z0-9,.!'" ]*$/;

      if (comment === "") {
        return res.status(400).json("Review must not be empty.");
      }

      if (comment.length > MAX_COMMENT_SIZE || !regex.test(comment)) {
        return res.status(400).json("Invalid review content.");
      }

      const censoredComment = censorText(comment);
      // console.log(`Filtered Review: ${censoredComment}`);

      await prisma.review.create({
        data: {
          user_id: user.id,
          player_id: req.body.player_id,
          rating: Number(req.body.rating),
          comment: censoredComment,
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
      return res
        .sendStatus(401)
        .json("Error occurred when trying to delete a review");
    }
  } catch (error) {
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
