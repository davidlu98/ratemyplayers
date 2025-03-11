const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const prisma = new PrismaClient();

// Enum values for Region and Server
const regions = ["NA", "EU"];
const naServers = ["SCANIA", "BERA", "AURORA", "ELYSIUM", "KRONOS", "HYPERION"];
const euServers = ["LUNA", "SOLIS"];
const burningServer = ["BURNING"];

// Archetypes, Branches, and Job Classes
const archetypes = [
  "Explorer",
  "Cygnus Knight",
  "Resistance",
  "Nova",
  "Sengoku",
];
const branches = ["Warrior", "Mage", "Archer", "Thief", "Pirate"];
const jobClasses = {
  Warrior: ["Hero", "Paladin", "Dark Knight", "Mihile"],
  Mage: ["Bishop", "Ice Lightning Archmage", "Fire Poison Archmage"],
  Archer: ["Bowmaster", "Marksman", "Pathfinder"],
  Thief: ["Night Lord", "Shadower", "Dual Blade"],
  Pirate: ["Buccaneer", "Corsair", "Cannoneer"],
};

// Generate random players
async function generatePlayers(numPlayers) {
  const players = [];

  for (let i = 0; i < numPlayers; i++) {
    const region = faker.helpers.arrayElement(regions);
    const server =
      region === "NA"
        ? faker.helpers.arrayElement(naServers)
        : faker.helpers.arrayElement(euServers);

    const archetype = faker.helpers.arrayElement(archetypes);
    const branch = faker.helpers.arrayElement(branches);
    const job_class = faker.helpers.arrayElement(jobClasses[branch]);

    const player = await prisma.player.create({
      data: {
        current_name: faker.internet.username(), // Generates unique player names??
        region,
        server,
        level: faker.number.int({ min: 10, max: 300 }),
        archetype,
        branch,
        job_class,
      },
    });

    players.push(player);
  }

  return players;
}

// Generate random reviews for players
async function generateReviews(players, minReviews, maxReviews) {
  for (const player of players) {
    const numReviews = faker.number.int({ min: minReviews, max: maxReviews });

    for (let i = 0; i < numReviews; i++) {
      await prisma.review.create({
        data: {
          player_id: player.id,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
          created_at: faker.date.recent({ days: 180 }), // Within the last 6 months
        },
      });
    }
  }
}

async function main() {
  console.log("Seeding database...");

  const numPlayers = 50; // Adjust number of players as needed
  const players = await generatePlayers(numPlayers);

  await generateReviews(players, 1, 5); // Min 1, max 5 reviews per player

  console.log("Seeding complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
