const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Replace this array with the user IDs to shadow ban
const USER_IDS_TO_BAN = [
  "6f53e4dd-d011-4402-bd78-09d9b9c5a0be",
  "7c05d709-e8c9-4884-9771-8f4d4d62f503",
  // ...
];

(async () => {
  try {
    const updateResults = await Promise.all(
      USER_IDS_TO_BAN.map((id) =>
        prisma.user.update({
          where: { id },
          data: { shadow_banned: true },
        })
      )
    );

    console.log(`✅ Shadow banned ${updateResults.length} users.`);
  } catch (error) {
    console.error("❌ Error shadow banning users:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
