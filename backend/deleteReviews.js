// deleteReviews.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 🔧 Replace this with your list of review IDs
const reviewIds = ["91f3f939-e5ba-4cec-9ae0-3e3ef06da026"];

async function main() {
  for (const id of reviewIds) {
    try {
      await prisma.review.delete({
        where: { id },
      });
      console.log(`✅ Deleted review with ID: ${id}`);
    } catch (error) {
      if (error.code === "P2025") {
        console.warn(
          `⚠️ Review with ID ${id} does not exist or was already deleted.`
        );
      } else {
        console.error(`❌ Error deleting review with ID ${id}:`, error);
      }
    }
  }
}

main()
  .catch((e) => console.error("❌ Script error:", e))
  .finally(() => prisma.$disconnect());
