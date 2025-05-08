const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Replace with the actual player ID you want to query
const PLAYER_ID = "98adeaaf-8e6d-44bc-948d-71a670ffa96c";

(async () => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        player_id: PLAYER_ID,
      },
      select: {
        user: {
          select: {
            id: true,
            ip_address: true,
            username: true,
          },
        },
      },
    });

    const grouped = {};

    for (const review of reviews) {
      const ip = review.user.ip_address || "unknown";
      const userId = review.user.id;
      const username = review.user.username;

      if (!grouped[ip]) {
        grouped[ip] = new Map(); // Use Map to avoid duplicates
      }

      grouped[ip].set(userId, username);
    }

    const output = {};
    for (const [ip, usersMap] of Object.entries(grouped)) {
      output[ip] = Array.from(usersMap.entries()).map(([id, username]) => ({
        id,
        username,
      }));
    }

    console.log(`Grouped users by IP for player ID: ${PLAYER_ID}`);
    console.log(JSON.stringify(output, null, 2));
  } catch (error) {
    console.error("❌ Error grouping users by IP:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
