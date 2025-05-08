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

  let requesterId = null;

  try {
    // Extract requester ID from token
    const token = req.headers.authorization;
    if (token) {
      const decoded = jwt.verify(token, "LUNA");
      requesterId = decoded?.id || null;
    }
  } catch {
    requesterId = null;
  }

  try {
    const whereFilter = requesterId
      ? {
          player_id,
          OR: [{ user: { shadow_banned: false } }, { user_id: requesterId }],
        }
      : {
          player_id,
          user: { shadow_banned: false },
        };

    const reviews = await prisma.review.findMany({
      where: whereFilter,
      select: {
        rating: true,
      },
    });

    res.send(reviews);
  } catch (error) {
    console.error("Error in /:player_id/all route:", error);
    res.status(500).send("Something went wrong.");
  }
});

router.get("/:player_id", async (req, res) => {
  const { player_id } = req.params;
  const { sortBy, rating } = req.query;

  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;

  let orderBy = { created_at: "desc" };
  if (sortBy === "oldest") orderBy = { created_at: "asc" };
  if (sortBy === "most_upvotes")
    orderBy = [{ upvotes: "desc" }, { created_at: "desc" }];
  if (sortBy === "most_downvotes")
    orderBy = [{ downvotes: "desc" }, { created_at: "desc" }];

  let baseWhere = { player_id };
  if (rating !== "all") {
    baseWhere.rating = parseInt(rating);
  }

  // Check if request is from a logged-in user
  let requesterId = null;
  try {
    const token = req.headers.authorization;
    if (token) {
      const decoded = jwt.decode(token, "LUNA");
      if (decoded && decoded.id) {
        requesterId = decoded.id;
      }
    }
  } catch (_) {
    // silently ignore invalid tokens
  }

  // Define shared filtering logic for reviews
  const userFilter = requesterId
    ? {
        OR: [
          { user: { shadow_banned: false } },
          { user_id: requesterId }, // include own reviews even if shadow banned
        ],
      }
    : { user: { shadow_banned: false } };

  try {
    const totalReviews = await prisma.review.count({
      where: {
        ...baseWhere,
        ...userFilter,
      },
    });

    const reviews = await prisma.review.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        ...baseWhere,
        ...userFilter,
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
      orderBy,
    });

    res.json({
      reviews,
      totalPages: Math.ceil(totalReviews / pageSize),
      totalReviews,
    });
  } catch (error) {
    res.status(500).json("Failed to fetch reviews.");
  }
});

const notAllowedPlayerIds = [
  "4c5b8f30-6604-456c-8032-c5d1751a19b4", // Comet
  "98adeaaf-8e6d-44bc-948d-71a670ffa96c", // Aelika
  "6e4361bf-4716-43f0-9404-0c4407f10071", // Emallies
  "449cac55-5322-479d-8def-2a1daf61982d", // IceMuscle
  "2d639199-c7d7-4863-9a35-c741d4a71b25", // AxeChris
];

router.post("/", async (req, res, next) => {
  const { player_id } = req.body;

  if (notAllowedPlayerIds.includes(player_id)) {
    return res.status(403).json("Reviews are disabled for this account.");
  }

  try {
    const token = req.headers.authorization;
    const decoded = jwt.decode(token, "LUNA");

    if (!decoded) {
      return res.status(401).json("Must be logged in to submit a review.");
    }

    // Fetch the user from the DB to get up-to-date banned status
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json("User not found.");
    }

    if (user.banned) {
      return res.status(403).json("You are banned and cannot submit reviews.");
    }

    const comment = req.body.comment.trim();
    const regex = /^[a-zA-Z0-9,.!'" ]*$/;

    const existingReview = await prisma.review.findUnique({
      where: {
        user_id_player_id: {
          user_id: user.id,
          player_id: req.body.player_id,
        },
      },
    });

    if (existingReview) {
      return res
        .status(400)
        .json("You've already made a review for this player.");
    }

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

    const isToxic = censoredText.includes("*");

    if (isToxic && !user.shadow_banned) {
      await prisma.user.update({
        where: { id: user.id },
        data: { shadow_banned: true },
      });
    }

    await prisma.review.create({
      data: {
        user_id: user.id,
        player_id: req.body.player_id,
        rating: Number(req.body.rating),
        comment: censoredText,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.decode(token, "LUNA");

    if (!user) {
      return res.status(401).json("Unauthorized");
    }

    const review = await prisma.review.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!review) {
      return res.status(404).json("Review not found");
    }

    if (review.user_id !== user.id) {
      return res
        .status(403)
        .json("You do not have permission to delete this review.");
    }

    await prisma.review.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
