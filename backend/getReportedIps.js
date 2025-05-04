// scripts/getReportedIps.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const reports = await prisma.report.findMany({
    include: {
      review: {
        select: {
          user_id: true,
          user: {
            select: {
              ip_address: true,
            },
          },
        },
      },
    },
  });

  const ipMap = new Map();

  for (const report of reports) {
    const userId = report.review?.user_id;
    const ip = report.review?.user?.ip_address;

    if (!ip || !userId) continue;

    if (!ipMap.has(ip)) {
      ipMap.set(ip, {
        ipAddress: ip,
        reportCount: 1,
        users: new Set([userId]),
      });
    } else {
      const entry = ipMap.get(ip);
      entry.reportCount += 1;
      entry.users.add(userId);
    }
  }

  const results = Array.from(ipMap.values()).map((entry) => ({
    ipAddress: entry.ipAddress,
    reportCount: entry.reportCount,
    uniqueUsersReported: entry.users.size,
  }));

  console.log("Reported IP addresses:");
  console.table(results);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
