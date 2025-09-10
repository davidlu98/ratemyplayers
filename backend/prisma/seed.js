// prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
    "Grace",
    "Heidi",
    "Ivan",
    "Judy",
    "Mallory",
    "Niaj",
    "Olivia",
    "Peggy",
    "Sybil",
  ];

  const playerIdsOne = [
    "b04ddf4a-a344-4e7a-87ed-813da7c9b13f",
    "a8c34faa-b807-4202-81d4-40e19510c445",
    "16d16ccc-5ccc-404a-853d-44af904e7d9a",
    "29078fd0-e439-4a79-b9da-9fc196d2603b",
    "74169bb0-60e8-463a-b1bd-79a4094afb90",
    "c603b29c-535e-4d92-85af-4fc52202f322",
    "cfa4c211-c188-4aeb-89da-483afdd448c5",
    "d9810a9c-7658-4470-aa48-6b9f39bf5bc8",
    "b3545d29-8feb-434d-a441-6888d99ec4e5",
    "fff5e08e-06d1-43a8-9740-6b0b552b8abc",
  ];

  const playerIdsTwo = [
    "a8c34faa-b807-4202-81d4-40e19510c445",
    "b04ddf4a-a344-4e7a-87ed-813da7c9b13f",
    "29078fd0-e439-4a79-b9da-9fc196d2603b",
    "16d16ccc-5ccc-404a-853d-44af904e7d9a",
    "c603b29c-535e-4d92-85af-4fc52202f322",
    "74169bb0-60e8-463a-b1bd-79a4094afb90",
    "d9810a9c-7658-4470-aa48-6b9f39bf5bc8",
    "cfa4c211-c188-4aeb-89da-483afdd448c5",
    "fff5e08e-06d1-43a8-9740-6b0b552b8abc",
    "b3545d29-8feb-434d-a441-6888d99ec4e5",
  ];

  const reviewMessages = [
    "Friendly player.",
    "You've got amazing hands. Your mechanics are so clean.",
    "You adapt so fast to difficult boss patterns.",
    "Your movement is so fluid.",
    "GG Well Played",
    "You're the kind of teammate everyone wants!",
    "Handsome and talented.",
    "That class is so broken lol.",
    "GOAT player?",
    "Flawless gameplay.",
  ];

  const shuffled = names.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 10);

  const hashedPassword = await bcrypt.hash("password", 10);

  for (let i = 0; i < selected.length; i++) {
    const name = selected[i];

    // Assign IPs: max 5 per address
    const ip_address = `127.0.0.${Math.floor(i / 5) + 1}`;

    let userAccount = await prisma.user.create({
      data: {
        username: name,
        password: hashedPassword,
        ip_address,
      },
    });

    let firstReview = await prisma.review.create({
      data: {
        user_id: userAccount.id,
        player_id: playerIdsOne[i],
        rating: Math.floor(Math.random() * 3) + 3,
        comment: reviewMessages[i],
      },
    });

    await prisma.vote.create({
      data: {
        user_id: userAccount.id,
        review_id: firstReview.id,
        value: 1,
      },
    });

    await prisma.review.update({
      where: {
        id: firstReview.id,
      },
      data: {
        upvotes: 1,
      },
    });

    let secondReview = await prisma.review.create({
      data: {
        user_id: userAccount.id,
        player_id: playerIdsTwo[i],
        rating: Math.floor(Math.random() * 3) + 3,
        comment: reviewMessages[i],
      },
    });

    await prisma.vote.create({
      data: {
        user_id: userAccount.id,
        review_id: secondReview.id,
        value: -1,
      },
    });

    await prisma.review.update({
      where: {
        id: secondReview.id,
      },
      data: {
        downvotes: 1,
      },
    });
  }

  console.log("✅ 10 accounts created, split across 2 IPs");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
