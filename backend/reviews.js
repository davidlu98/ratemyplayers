const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fs = require("fs");
const path = require("path");

// all routes have prefix /reviews

const MAX_COMMENT_SIZE = 200;

const badWords = fs
  .readFileSync(path.join(__dirname, "badwords.txt"), "utf8")
  .split("\n")
  .map((word) => word.trim().toLowerCase())
  .filter((word) => word.length > 0);

const leetMap = {
  a: "[a24]",
  e: "[e3]",
  i: "[i1!]",
  o: "[o0]",
  s: "[s5]",
  t: "[t7]",
  b: "[b8]",
  g: "[g9]",
  z: "[z2]",
};

function buildLeetRegex(word) {
  const pattern = word
    .toLowerCase()
    .split("")
    .map((char) => leetMap[char] || char)
    .join("");
  return new RegExp(pattern, "gi"); // global + case-insensitive
}

function extraCensor(text, badWords) {
  for (const word of badWords) {
    const regex = buildLeetRegex(word);
    text = text.replace(regex, (match) => "*".repeat(match.length));
  }
  return text;
}

const {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} = require("obscenity");

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

function censorFromMatches(originalText, matches) {
  // Sort matches by startIndex to ensure processing is done in order
  matches.sort((a, b) => a.startIndex - b.startIndex);

  let censored = "";
  let currentIndex = 0;

  for (const match of matches) {
    // Handle skipped area before this match
    if (match.startIndex > currentIndex) {
      censored += originalText.slice(currentIndex, match.startIndex);
    }

    // Replace the matched word with asterisks of the same length
    censored += "*".repeat(match.endIndex - match.startIndex + 1);

    // Update current index to just after the match
    currentIndex = match.endIndex + 1;
  }

  // Append any remaining text after the last match
  if (currentIndex < originalText.length) {
    censored += originalText.slice(currentIndex);
  }

  return censored;
}

function mergeMatches(matches) {
  const result = [];

  matches.sort((a, b) => a.startIndex - b.startIndex);

  for (const match of matches) {
    const last = result[result.length - 1];

    if (!last || match.startIndex > last.endIndex) {
      result.push(match);
    } else {
      // Merge overlapping match
      last.endIndex = Math.max(last.endIndex, match.endIndex);
      last.matchLength = last.endIndex - last.startIndex + 1;
    }
  }

  return result;
}

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

      const matches = matcher.getAllMatches(comment);
      const cleanedMatches = mergeMatches(matches);
      let censoredText = censorFromMatches(comment, cleanedMatches);
      censoredText = extraCensor(censoredText, badWords);

      console.log(censoredText);

      await prisma.review.create({
        data: {
          user_id: user.id,
          player_id: req.body.player_id,
          rating: Number(req.body.rating),
          comment: censoredText,
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
