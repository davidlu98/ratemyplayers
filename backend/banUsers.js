const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ips:
// 172.56.177.154 = jerry

// Example: replace with your target user IDs
const userIdsToBan = [
  "2ea6b2cf-644e-41fb-851b-f1b8c4316a49",
  "554f03d8-ab19-4ef3-b92a-a23034e631bd",
  "460343ab-1793-44d3-b07b-47e3ef776b66",
  "63e296cc-b157-4df4-b881-17e6cf28c700",
  // Add more as needed
];

async function banUsers() {
  try {
    const result = await prisma.user.updateMany({
      where: {
        id: {
          in: userIdsToBan,
        },
      },
      data: {
        banned: true,
      },
    });

    console.log(`Successfully banned ${result.count} user(s).`);
  } catch (error) {
    console.error("Error banning users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

banUsers();
