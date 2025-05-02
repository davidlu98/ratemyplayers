const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const MAX_REASON_SIZE = 200;

// all routes have prefix /reports

router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.decode(token, "LUNA");

    if (user) {
      const reason = req.body.reason.trim();
      const regex = /^[a-zA-Z0-9,.!'" ]*$/;

      const existingReport = await prisma.report.findUnique({
        where: {
          user_id_review_id: {
            user_id: user.id,
            review_id: req.body.review_id,
          },
        },
      });

      if (existingReport) {
        return res.status(400).json("You've already reported this review.");
      }

      if (reason === "") {
        return res.status(400).json("Reason must not be empty.");
      }

      if (reason.length > MAX_REASON_SIZE || !regex.test(reason)) {
        return res.status(400).json("Invalid review content.");
      }

      await prisma.report.create({
        data: {
          user_id: user.id,
          review_id: req.body.review_id,
          type: req.body.type,
          reason,
        },
      });
      return res.sendStatus(200);
    } else {
      return res.status(401).json("Must be logged in to report a review.");
    }
  } catch (error) {
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
