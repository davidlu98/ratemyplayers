const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// all routes have prefix /vote

router.post("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.decode(token, "LUNA");

    if (user) {
      const existingVote = await prisma.vote.findFirst({
        where: {
          user_id: user.id,
          review_id: req.body.review_id,
        },
      });

      if (existingVote) {
        // If user changing upvote -> downvote or downvote -> upvote
        if (existingVote.value !== Number(req.body.value)) {
          await prisma.vote.update({
            where: { id: existingVote.id },
            data: { value: Number(req.body.value) },
          });
        } else {
          await prisma.vote.delete({
            where: { id: existingVote.id },
          });
        }
      } else {
        await prisma.vote.create({
          data: {
            user_id: user.id,
            review_id: req.body.review_id,
            value: Number(req.body.value),
          },
        });
      }

      return res.sendStatus(201);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(500);
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
