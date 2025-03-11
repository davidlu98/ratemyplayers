const router = require("express").Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const axios = require("axios");
const cheerio = require("cheerio");

// all routes have prefix /players

const jobCategorization = {
  // Explorer Archetype
  Hero: { archetype: "Explorer", branch: "Warrior" },
  Paladin: { archetype: "Explorer", branch: "Warrior" },
  "Dark Knight": { archetype: "Explorer", branch: "Warrior" },
  "Fire Poison Archmage": { archetype: "Explorer", branch: "Mage" },
  "Ice Lightning Archmage": { archetype: "Explorer", branch: "Mage" },
  Bishop: { archetype: "Explorer", branch: "Mage" },
  Bowmaster: { archetype: "Explorer", branch: "Archer" },
  Marksman: { archetype: "Explorer", branch: "Archer" },
  Pathfinder: { archetype: "Explorer", branch: "Archer" },
  Corsair: { archetype: "Explorer", branch: "Pirate" },
  Buccaneer: { archetype: "Explorer", branch: "Pirate" },
  "Cannon Master": { archetype: "Explorer", branch: "Pirate" },
  "Night Lord": { archetype: "Explorer", branch: "Thief" },
  Shadower: { archetype: "Explorer", branch: "Thief" },
  "Blade Master": { archetype: "Explorer", branch: "Thief" },

  // Cygnus Knight Archetype
  Mihile: { archetype: "Cygnus Knight", branch: "Warrior" },
  "Dawn Warrior": { archetype: "Cygnus Knight", branch: "Warrior" },
  "Wind Archer": { archetype: "Cygnus Knight", branch: "Archer" },
  "Blaze Wizard": { archetype: "Cygnus Knight", branch: "Mage" },
  "Night Walker": { archetype: "Cygnus Knight", branch: "Thief" },
  "Thunder Breaker": { archetype: "Cygnus Knight", branch: "Pirate" },

  // Resistance Archetype
  Blaster: { archetype: "Resistance", branch: "Warrior" },
  "Demon Slayer": { archetype: "Resistance", branch: "Warrior" },
  "Demon Avenger": { archetype: "Resistance", branch: "Warrior" },
  "Battle Mage": { archetype: "Resistance", branch: "Mage" },
  "Wild Hunter": { archetype: "Resistance", branch: "Archer" },
  Mechanic: { archetype: "Resistance", branch: "Pirate" },
  Xenon: { archetype: "Resistance", branch: "Thief" },

  // Nova Archetype
  Kaiser: { archetype: "Nova", branch: "Warrior" },
  "Angelic Buster": { archetype: "Nova", branch: "Pirate" },
  Kain: { archetype: "Nova", branch: "Archer" },
  Cadena: { archetype: "Nova", branch: "Thief" },

  // Hero Archetype
  Mercedes: { archetype: "Hero", branch: "Archer" },
  Aran: { archetype: "Hero", branch: "Warrior" },
  Phantom: { archetype: "Hero", branch: "Thief" },
  Luminous: { archetype: "Hero", branch: "Mage" },
  Evan: { archetype: "Hero", branch: "Mage" },
  Shade: { archetype: "Hero", branch: "Pirate" },

  // Sengoku Archetype
  Hayato: { archetype: "Sengoku", branch: "Warrior" },
  Kanna: { archetype: "Sengoku", branch: "Mage" },

  // Flora Archetype
  Adele: { archetype: "Flora", branch: "Warrior" },
  Ark: { archetype: "Flora", branch: "Pirate" },
  Illium: { archetype: "Flora", branch: "Mage" },
  Khali: { archetype: "Flora", branch: "Thief" },

  // Anima Archetype
  HoYoung: { archetype: "Anima", branch: "Thief" },
  Lara: { archetype: "Anima", branch: "Mage" },

  // Kinesis Archetype
  Kinesis: { archetype: "Kinesis", branch: "Mage" },

  // Zero Archetype
  Zero: { archetype: "Zero", branch: "Warrior" },

  // Lynn Archetype
  Lynn: { archetype: "Lynn", branch: "Mage" },
};

const getJobCategory = (job) => {
  const jobInfo = jobCategorization[job];
  return jobInfo;
};

const parseText = (input) => {
  // Regex to capture username, level, player job (with spaces), and server
  const regex = /(\w+)\s+is\s+a\s+level\s+(\d+)\s+([a-zA-Z\s]+)\s+in\s+(.+)\.$/;
  const match = input.match(regex);

  if (match) {
    const username = match[1]; // First word: username
    const level = match[2]; // Second word: level
    const job = match[3].trim(); // Third part: job (could be multi-word)
    const server = match[4].trim(); // Everything after 'in': server

    return {
      username,
      level,
      job,
      server,
    };
  } else {
    return { error: "Invalid input format" };
  }
};

// TODO
const fetchMapleRanksData = async (region, name) => {
  try {
    const link =
      region === "NA"
        ? `https://mapleranks.com/u/${name}`
        : `https://mapleranks.com/u/eu/${name}`;

    const mapleRanksResponse = await axios.get(link, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!mapleRanksResponse.data) {
      return null;
    }
    const html = mapleRanksResponse.data;
    const $ = cheerio.load(html);

    const avatarURL = $(".card-img-top").attr("src");
    const description = $("meta[name=description]").attr("content");

    if (!description) {
      return null;
    }

    const { username, level, job, server } = parseText(description);

    if (!username || !level || !job || !server) {
      return null;
    }

    const jobInformation = getJobCategory(job);

    return {
      username,
      level,
      job,
      jobInformation,
      server,
      avatarURL,
    };
  } catch (error) {
    console.error("Error fetching MapleRanks data:", error.message);
    return null;
  }
};

router.get("/:region/:name", async (req, res, next) => {
  try {
    const { region, name } = req.params;

    let player = await prisma.player.findUnique({
      where: {
        current_name_lower: name.toLowerCase(),
        region: region,
      },
    });

    if (player) {
      return res.send(player);
    }

    if (!player) {
      const previousNameEntry = await prisma.previousName.findFirst({
        where: { name_lower: name.toLowerCase() },
        orderBy: {
          changed_at: "desc",
        },
        include: {
          player: true,
        },
      });

      if (previousNameEntry) {
        player = previousNameEntry.player;
        return res.send(player);
      }
    }

    if (!player) {
      const playerInformation = await fetchMapleRanksData(region, name);

      if (!playerInformation || typeof playerInformation !== "object") {
        return res.status(404).json({ message: "Player not found" });
      }
      const { username, level, job, jobInformation, server, avatarURL } =
        playerInformation;

      // Create the player
      const newPlayer = await prisma.player.create({
        data: {
          current_name: username,
          current_name_lower: username.toLowerCase(),
          region: region,
          server: server,
          level: Number(level),
          archetype: jobInformation.archetype,
          branch: jobInformation.branch,
          job: job,
          avatar: avatarURL,
        },
      });

      return res.send(newPlayer);
    }
  } catch (error) {
    next(error);
  }
});

// router.patch("/:name", async (req, res, next) => {
//   try {
//     const updatedPlayer = await prisma.player.update({
//       where: {
//         current_name: req.params.name,
//       },
//       data: {},
//     });
//     res.send(updatedPlayer);
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
