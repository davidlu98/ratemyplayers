const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// all routes have prefix /vote

router.post("/", async (req, res, next) => {
  const token = req.headers.authorization;
  const user = jwt.decode(token, "LUNA");

  try {
    if (user) {
      const existingVote = await prisma.vote.findFirst({
        where: {
          user_id: user.id,
          review_id: req.body.review_id,
        },
      });

      await prisma.$transaction(async (tx) => {
        if (!existingVote) {
          await tx.vote.create({
            data: {
              user_id: user.id,
              review_id: req.body.review_id,
              value: Number(req.body.value),
            },
          });

          await tx.review.update({
            where: {
              id: req.body.review_id,
            },
            data: {
              upvotes: { increment: Number(req.body.value) === 1 ? 1 : 0 },
              downvotes: { increment: Number(req.body.value) === -1 ? 1 : 0 },
            },
          });
        } else if (existingVote.value !== Number(req.body.value)) {
          // If user changing upvote -> downvote or downvote -> upvote
          await tx.vote.update({
            where: { id: existingVote.id },
            data: { value: Number(req.body.value) },
          });

          await tx.review.update({
            where: { id: req.body.review_id },
            data: {
              upvotes: {
                increment: Number(req.body.value) === 1 ? 1 : -1,
              },
              downvotes: {
                increment: Number(req.body.value) === -1 ? 1 : -1,
              },
            },
          });
        } else {
          // If user wants to remove a vote upvote -> upvote or downvote -> downvote
          await tx.vote.delete({
            where: { id: existingVote.id },
          });

          await tx.review.update({
            where: { id: req.body.review_id },
            data: {
              upvotes: existingVote.value === 1 ? { decrement: 1 } : undefined,
              downvotes:
                existingVote.value === -1 ? { decrement: 1 } : undefined,
            },
          });
        }
      });

      return res.sendStatus(201);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get("/:reviewId", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.decode(token, "LUNA");

    if (user) {
      const existingVote = await prisma.vote.findFirst({
        where: {
          user_id: user.id,
          review_id: req.params.reviewId,
        },
      });

      if (existingVote) {
        return res.send({ value: existingVote.value });
      } else {
        return res.send({ value: 0 });
      }
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
