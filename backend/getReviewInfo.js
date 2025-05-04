// getReviewInfo.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 🔧 Replace this with the review ID you want to look up
const reviewId = "f97d1ad8-c3c5-436f-8c36-991972bef399";

async function main() {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      user: true,
    },
  });

  if (!review) {
    console.log(`❌ No review found with ID: ${reviewId}`);
    return;
  }

  console.log(`Review ID: ${review.id}`);
  console.log(`Player ID: ${review.player_id}`);
  console.log(`User ID:   ${review.user_id}`);
  console.log(`IP Address of user: ${review.user.ip_address}`);
}

main()
  .catch((e) => console.error("❌ Error:", e))
  .finally(() => prisma.$disconnect());
