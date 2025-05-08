const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    // Find all reviews that contain an asterisk in the comment
    const toxicReviews = await prisma.review.findMany({
      where: {
        comment: {
          contains: "*",
        },
      },
      select: {
        user_id: true,
      },
    });

    // Extract unique user IDs
    const toxicUserIds = [
      ...new Set(toxicReviews.map((review) => review.user_id)),
    ];

    console.log(`Shadow banning ${toxicUserIds.length} users...`);

    // Update each user to shadow_banned = true
    for (const userId of toxicUserIds) {
      await prisma.user.update({
        where: { id: userId },
        data: { shadow_banned: true },
      });
      console.log(`User ${userId} shadow banned.`);
    }

    console.log("✅ Shadow banning complete.");
  } catch (error) {
    console.error("❌ Error during shadow banning:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
