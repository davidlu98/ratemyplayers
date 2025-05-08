// deleteReviews.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 🔧 Replace this with your list of review IDs
const reviewIds = ["401f74d2-f5ed-427b-a1eb-bff50f7db3e6"];

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
