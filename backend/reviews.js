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
  try {
    // const allReviews = await prisma.review.findMany({
    //   where: {
    //     player_id: req.params.player_id,
    //   },
    //   select: {
    //     id: true,
    //     comment: true,
    //     anonymous: true,
    //   },
    // });

    // res.send(allReviews);

    const reviews = await prisma.review.findMany({
      where: {
        player_id: req.params.player_id,
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

    const sanitizedReviews = reviews.map((review) => ({
      ...review,
      user: review.anonymous ? null : review.user,
    }));

    res.send(sanitizedReviews);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.decode(token, "LUNA");

    if (user) {
      const review = await prisma.review.create({
        data: {
          user_id: user.id,
          player_id: req.body.player_id,
          rating: Number(req.body.rating),
          comment: req.body.comment,
          anonymous: req.body.anonymous,
        },
      });
      return res.send(review);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    next(error);
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
