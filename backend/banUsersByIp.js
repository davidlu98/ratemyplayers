// banUsersByIp.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// IPs to ban (add as needed)
const ipAddressesToBan = [
  "123.456.789.10",
  // ...
];

async function main() {
  const users = await prisma.user.findMany({
    where: {
      ip_address: {
        in: ipAddressesToBan,
      },
    },
  });

  if (users.length === 0) {
    console.log("No users found with the specified IP addresses.");
    return;
  }

  for (const user of users) {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { banned: true },
      });

      const deleted = await prisma.review.deleteMany({
        where: { user_id: user.id },
      });

      console.log(
        `✅ Banned user: ${user.username} (${user.id}), IP: ${user.ip_address}, deleted ${deleted.count} review(s)`
      );
    } catch (error) {
      console.error(`❌ Failed to process user ${user.id}:`, error.message);
    }
  }
}

main()
  .catch((e) => console.error("❌ Unexpected error:", e))
  .finally(() => prisma.$disconnect());
