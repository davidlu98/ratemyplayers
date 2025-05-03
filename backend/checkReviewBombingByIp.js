// checkReviewBombingByIp.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkAndBanReviewBombers() {
  // Step 1: Get all unique IPs from banned users
  const bannedIps = await prisma.user.findMany({
    where: { banned: true },
    select: { ip_address: true },
    distinct: ["ip_address"],
  });

  const ipList = bannedIps.map((u) => u.ip_address);
  console.log(`🔍 Found ${ipList.length} unique banned IPs.`);

  // Step 2: Find users with matching IPs who are not yet banned
  const suspiciousUsers = await prisma.user.findMany({
    where: {
      ip_address: { in: ipList },
      banned: false,
    },
    select: {
      id: true,
      username: true,
      ip_address: true,
      created_at: true,
    },
  });

  if (suspiciousUsers.length === 0) {
    console.log("✅ No suspicious users found.");
    return;
  }

  console.log(`⚠️ Found ${suspiciousUsers.length} suspicious users:`);

  for (const user of suspiciousUsers) {
    console.log(
      `- User ID: ${user.id}, Username: ${user.username}, IP: ${user.ip_address}, Created: ${user.created_at}`
    );
  }

  // Step 3: Delete reviews from these users
  const userIds = suspiciousUsers.map((u) => u.id);

  const deletedReviews = await prisma.review.deleteMany({
    where: {
      user_id: { in: userIds },
    },
  });

  console.log(
    `🗑️ Deleted ${deletedReviews.count} reviews from suspicious users.`
  );

  // Step 4: Ban the users
  const banned = await prisma.user.updateMany({
    where: {
      id: { in: userIds },
    },
    data: { banned: true },
  });

  console.log(`🚫 Banned ${banned.count} suspicious users.`);
}

checkAndBanReviewBombers()
  .catch((e) => {
    console.error("❌ Error:", e);
  })
  .finally(() => prisma.$disconnect());
