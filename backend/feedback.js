const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const MAX_FEEDBACK_SIZE = 300;

// all routes have prefix /feedback

router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.decode(token, "LUNA");

    if (user) {
      const feedback = req.body.feedback.trim();
      const regex = /^[a-zA-Z0-9,.!'" ]*$/;

      const existingFeedback = await prisma.feedback.findUnique({
        where: {
          user_id: user.id,
        },
      });

      if (existingFeedback) {
        return res.status(400).json("You've already submitted feedback.");
      }

      if (feedback === "") {
        return res.status(400).json("Feedback must not be empty.");
      }

      if (feedback.length > MAX_FEEDBACK_SIZE || !regex.test(feedback)) {
        return res.status(400).json("Invalid feedback content.");
      }

      await prisma.feedback.create({
        data: {
          user_id: user.id,
          feedback,
        },
      });

      return res.sendStatus(200);
    } else {
      return res.status(401).json("Must be logged in to submit feedback.");
    }
  } catch (error) {
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
