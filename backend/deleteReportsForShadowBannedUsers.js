const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    // Step 1: Get all review IDs where the author (user) is shadow banned
    const shadowBannedReviews = await prisma.review.findMany({
      where: {
        user: {
          shadow_banned: true,
        },
      },
      select: {
        id: true,
      },
    });

    const shadowBannedReviewIds = shadowBannedReviews.map((r) => r.id);

    console.log(
      `Found ${shadowBannedReviewIds.length} reviews by shadow banned users.`
    );

    if (shadowBannedReviewIds.length === 0) {
      console.log("✅ No reports to delete.");
      return;
    }

    // Step 2: Delete all reports for those review IDs
    const deleteResult = await prisma.report.deleteMany({
      where: {
        review_id: {
          in: shadowBannedReviewIds,
        },
      },
    });

    console.log(
      `✅ Deleted ${deleteResult.count} report(s) targeting reviews by shadow banned users.`
    );
  } catch (error) {
    console.error("❌ Error deleting reports:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
