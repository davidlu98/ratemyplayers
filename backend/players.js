const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const axios = require("axios");

// all routes have prefix /players

const jobCategorization = {
  // Explorer Archetype
  Beginner: { archetype: "Explorer", branch: "Beginner" },
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
  "Dual Blade": { archetype: "Explorer", branch: "Thief" },

  // Cygnus Knight Archetype
  Noblesse: { archetype: "Cygnus Knight", branch: "Noblesse" },
  Mihile: { archetype: "Cygnus Knight", branch: "Warrior" },
  "Dawn Warrior": { archetype: "Cygnus Knight", branch: "Warrior" },
  "Wind Archer": { archetype: "Cygnus Knight", branch: "Archer" },
  "Blaze Wizard": { archetype: "Cygnus Knight", branch: "Mage" },
  "Night Walker": { archetype: "Cygnus Knight", branch: "Thief" },
  "Thunder Breaker": { archetype: "Cygnus Knight", branch: "Pirate" },

  // Resistance Archetype
  Citizen: { archetype: "Resistance", branch: "Citizen" },
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
  Hoyoung: { archetype: "Anima", branch: "Thief" },
  Lara: { archetype: "Anima", branch: "Mage" },

  // Kinesis Archetype
  Kinesis: { archetype: "Kinesis", branch: "Mage" },

  // Zero Archetype
  Zero: { archetype: "Zero", branch: "Warrior" },

  // Jianghu Archetype
  Lynn: { archetype: "Jianghu", branch: "Mage" },
  "Mo Xuan": { archetype: "Jianghu", branch: "Pirate" },

  // Shine Archetype
  Sia: { archetype: "Shine", branch: "Mage" },
};

const getJobCategory = (job) => {
  const jobInfo = jobCategorization[job];
  return jobInfo;
};

router.get("/hot", async (req, res) => {
  try {
    const range = Array.isArray(req.query.range)
      ? req.query.range[0]
      : req.query.range;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const intervalMap = {
      "1h": 1 * 60 * 60 * 1000,
      "1d": 24 * 60 * 60 * 1000,
      "1w": 7 * 24 * 60 * 60 * 1000,
      "1m": 30 * 24 * 60 * 60 * 1000,
    };

    const selectedRange = intervalMap[range] || intervalMap["1d"];
    const since = new Date(Date.now() - selectedRange);

    // Decode JWT token to get requester user ID
    let requesterId = null;
    try {
      const token = req.headers.authorization;
      if (token) {
        const decoded = jwt.verify(token, "LUNA");
        requesterId = decoded?.id || null;
      }
    } catch {
      requesterId = null;
    }

    const shadowBanFilter = requesterId
      ? {
          OR: [{ user: { shadow_banned: false } }, { user_id: requesterId }],
        }
      : {
          user: { shadow_banned: false },
        };

    const baseWhere = {
      created_at: {
        gte: since,
      },
      ...shadowBanFilter,
    };

    const totalPlayersResult = await prisma.review.groupBy({
      by: ["player_id"],
      where: baseWhere,
    });

    const totalPlayers = totalPlayersResult.length;
    const totalPages = Math.ceil(totalPlayers / pageSize);

    const reviewGroups = await prisma.review.groupBy({
      by: ["player_id"],
      where: baseWhere,
      _count: {
        player_id: true,
      },
      _min: {
        created_at: true,
      },
      orderBy: [
        {
          _count: {
            player_id: "desc",
          },
        },
        {
          _min: {
            created_at: "asc",
          },
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const playerIds = reviewGroups.map((group) => group.player_id);

    const players = await prisma.player.findMany({
      where: {
        id: { in: playerIds },
      },
      select: {
        id: true,
        current_name: true,
        server: true,
        region: true,
        level: true,
        job: true,
      },
    });

    const leaderboard = reviewGroups.map((group) => {
      const player = players.find((p) => p.id === group.player_id);
      return {
        player_id: group.player_id,
        review_count: group._count.player_id,
        ...player,
      };
    });

    res.json({
      leaderboard,
      totalPages,
      totalPlayers,
    });
  } catch (error) {
    console.error("Error in /players/hot:", error);
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

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
    } else {
      const link =
        region === "NA"
          ? `https://www.nexon.com/api/maplestory/no-auth/ranking/v2/na?type=overall&id=weekly&reboot_index=0&page_index=1&character_name=${name}`
          : `https://www.nexon.com/api/maplestory/no-auth/ranking/v2/eu?type=overall&id=weekly&reboot_index=0&page_index=1&character_name=${name}`;

      const { data } = await axios.get(link);
      // console.log(data);

      if (data.totalCount === 0) {
        return res.status(500).json("Something went wrong. Please try again.");
      }

      const character = data.ranks[0];
      const characterName = character.characterName;
      const level = character.level;
      const characterImgURL = character.characterImgURL;
      const jobDetail = character.jobDetail;

      let worldID = character.worldID;
      let jobID = character.jobID;

      let jobName = "";
      let server = "";

      const serverMap = {
        1: "Bera",
        19: "Scania",
        30: "Luna",
        45: "Reboot Kronos",
        46: "Reboot Solis",
        70: "Reboot Hyperion",
      };

      server = serverMap[worldID] || "Unknown";

      const jobMap = {
        // Explorers
        0: {
          0: "Beginner",
        },
        1: {
          12: "Hero",
          22: "Paladin",
          32: "Dark Knight",
        },
        2: {
          12: "Fire Poison Archmage",
          22: "Ice Lightning Archmage",
          32: "Bishop",
        },
        3: {
          12: "Bowmaster",
          22: "Marksman",
          32: "Pathfinder",
        },
        4: {
          12: "Night Lord",
          22: "Shadower",
          32: "Dual Blade",
        },
        5: {
          12: "Buccaneer",
          22: "Corsair",
          32: "Cannon Master",
        },
        // Cygnus Knights
        10: "Noblesse",
        11: "Dawn Warrior",
        12: "Blaze Wizard",
        13: "Wind Archer",
        14: "Night Walker",
        15: "Thunder Breaker",
        202: "Mihile",
        // Resistance
        30: "Citizen",
        31: "Demon Slayer",
        32: "Battle Mage",
        33: "Wild Hunter",
        35: "Mechanic",
        208: "Xenon",
        209: "Demon Avenger",
        215: "Blaster",
        // Nova
        204: "Kaiser",
        205: "Angelic Buster",
        216: "Cadena",
        222: "Kain",
        // Anima
        220: "Hoyoung",
        223: "Lara",
        // Jianghu
        225: "Lynn",
        226: "Mo Xuan",
        // Shine
        227: "Sia",
        // Other
        210: "Zero",
        214: "Kinesis",
        // Heroes of Maple
        21: "Aran",
        22: "Evan",
        23: "Mercedes",
        24: "Phantom",
        212: "Shade",
        203: "Luminous",
        // Sengoku
        206: "Hayato",
        207: "Kanna",
        // Flora
        217: "Illium",
        218: "Ark",
        221: "Adele",
        224: "Khali",
      };

      if (jobMap[jobID]) {
        if (typeof jobMap[jobID] === "object" && jobID === 3) {
          jobName = jobMap[jobID][jobDetail] || "Pathfinder";
        } else if (typeof jobMap[jobID] === "object" && jobID === 4) {
          jobName = jobMap[jobID][jobDetail] || "Dual Blade";
        } else if (typeof jobMap[jobID] === "object" && jobID === 5) {
          jobName = jobMap[jobID][jobDetail] || "Cannon Master";
        } else {
          jobName = jobMap[jobID];
        }
      } else {
        jobName = "Unknown Job";
      }

      const jobInformation = getJobCategory(jobName);
      console.log(
        `${characterName} is a Level ${level} ${jobName} from ${server}`
      );
      console.log(characterImgURL);
      console.log(jobInformation);

      // Create the player
      const newPlayer = await prisma.player.create({
        data: {
          current_name: characterName,
          current_name_lower: characterName.toLowerCase(),
          region: region,
          server: server,
          level: Number(level),
          archetype: jobInformation.archetype,
          branch: jobInformation.branch,
          job: jobName,
          avatar: characterImgURL,
        },
      });

      console.log(newPlayer.id);
      return res.send(newPlayer);
      // return res.sendStatus(200);
    }
  } catch (error) {
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
