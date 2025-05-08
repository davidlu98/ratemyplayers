const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Replace this with the review ID you want to target
const REVIEW_ID = "6269c51e-6278-42f0-82eb-c90f8a11965e";

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
