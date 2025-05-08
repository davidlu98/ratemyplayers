const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Replace this with the review ID you want to target
const REVIEW_ID = "4a4231f6-471a-4728-b4d2-cc79f045076f";

(async () => {
  try {
    // Find the review and its associated user
    const review = await prisma.review.findUnique({
      where: { id: REVIEW_ID },
      select: { user_id: true },
    });

    if (!review) {
      console.log(`❌ Review with ID '${REVIEW_ID}' not found.`);
      return;
    }

    // Shadow ban the user
    const updatedUser = await prisma.user.update({
      where: { id: review.user_id },
      data: { shadow_banned: true },
    });

    console.log(`✅ User ${updatedUser.id} has been shadow banned.`);
  } catch (error) {
    console.error("❌ Error shadow banning user:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
