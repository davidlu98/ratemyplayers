const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// all routes have prefix /reviews

const MAX_COMMENT_SIZE = 200;

const fs = require("fs");
const path = require("path");
const levenshtein = require("fast-levenshtein");

const loadBadWords = (filename) =>
  fs
    .readFileSync(path.join(__dirname, filename), "utf-8")
    .split("\n")
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length > 0);

const badWords = loadBadWords("badwords.txt");
const extremeBadWords = loadBadWords("extremebadwords.txt");

// Map for Regex replacement (Example: s3xy & sexy)
const leetMap = {
  a: "[a4]",
  e: "[e3]",
  i: "[i1l!]",
  o: "[o0]",
  s: "[s5]",
  t: "[t7]",
};

const generateRegex = (word) => {
  let regexStr = word
    .split("")
    .map((char) => leetMap[char.toLowerCase()] || char)
    .join("");
  return new RegExp(`\\b${regexStr}\\b`, "gi"); // Match whole word
};

const badWordsRegex = badWords.map(generateRegex);
const extremeBadWordsRegex = extremeBadWords.map(generateRegex);

// Check for similar words based off of Levenshtein Distance (LD1/LD2)
const isSimilarToBadWord = (word, wordList, maxDistance) => {
  for (const badWord of wordList) {
    if (levenshtein.get(word.toLowerCase(), badWord) <= maxDistance) {
      return true;
    }
  }
  return false;
};

// Remove spaces from a string
const removeSpaces = (text) => text.replace(/\s+/g, "");

const censorText = (text) => {
  return text
    .split(/\b/)
    .map((word) => {
      const normalizedWord = word.toLowerCase();

      // Check if it matches a bad word
      if (
        badWordsRegex.some((regex) => regex.test(word)) ||
        isSimilarToBadWord(normalizedWord, badWords, 1)
      ) {
        return "*".repeat(word.length);
      }

      // Check if it matches an extreme bad word
      if (
        extremeBadWordsRegex.some((regex) => regex.test(word)) ||
        isSimilarToBadWord(normalizedWord, extremeBadWords, 2)
      ) {
        return "*".repeat(word.length);
      }

      // Detect word fragments
      for (const badWord of [...badWords, ...extremeBadWords]) {
        if (normalizedWord.includes(badWord)) {
          return "*".repeat(word.length);
        }
      }

      // Detect space-separated obfuscations
      const compactedWord = removeSpaces(normalizedWord);
      if (
        [...badWords, ...extremeBadWords].some((badWord) =>
          compactedWord.includes(badWord)
        )
      ) {
        return "*".repeat(word.length);
      }

      return word;
    })
    .join("");
};

// const censorText = (text) => {
//   return text
//     .split(/\b/)
//     .map((word) =>
//       badWordsRegex.some((regex) => regex.test(word)) ||
//       extremeBadWordsRegex.some((regex) => regex.test(word)) ||
//       isSimilarToBadWord(word)
//         ? "*".repeat(word.length)
//         : word
//     )
//     .join("");
// };

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
      console.log(`Filtered Review: ${censoredComment}`);

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
