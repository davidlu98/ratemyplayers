// groupReviewIpsByPlayer.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 🔧 Replace this with the player ID you want to investigate
const playerId = "980bd616-8377-44e6-b3de-30eaaeded332";

async function main() {
  const reviews = await prisma.review.findMany({
    where: {
      player_id: playerId,
    },
    include: {
      user: true, // Include user to access IP
    },
  });

  if (reviews.length === 0) {
    console.log("No reviews found for this player.");
    return;
  }

  const ipCounts = {};

  for (const review of reviews) {
    const ip = review.user.ip_address;
    ipCounts[ip] = (ipCounts[ip] || 0) + 1;
  }

  console.log(`Review counts by IP for player ID: ${playerId}`);
  console.table(ipCounts);
}

main()
  .catch((e) => console.error("❌ Unexpected error:", e))
  .finally(() => prisma.$disconnect());
