const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const MAX_FEEDBACK_SIZE = 300;

// all routes have prefix /feedback

router.post("/", async (req, res) => {
  const feedback = req.body.feedback.trim();
  const regex = /^[a-zA-Z0-9,.!'" ]*$/;

  try {
    if (feedback === "") {
      return res.status(400).json("Feedback must not be empty.");
    }

    if (feedback.length > MAX_FEEDBACK_SIZE || !regex.test(feedback)) {
      return res.status(400).json("Invalid feedback content.");
    }

    await prisma.feedback.create({
      data: {
        feedback,
      },
    });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
