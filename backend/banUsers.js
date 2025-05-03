const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ips:
// 172.56.177.154 = jerry

// Example: replace with your target user IDs
const userIdsToBan = [
  "9c97d43e-4b87-44d3-9ee4-7c51af1e39ce",
  // "2a66c730-0162-4b87-87d5-e1425d7ca437",
  // "342abe64-9c85-4745-9a76-21423763b3f8",
  // "f38a5d8b-6886-4871-97e3-540bf4749b03",
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
