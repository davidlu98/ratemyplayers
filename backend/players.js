const router = require("express").Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const axios = require("axios");

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
  "Dual Blade": { archetype: "Explorer", branch: "Thief" },

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
  Hoyoung: { archetype: "Anima", branch: "Thief" },
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

router.get("/hot", async (req, res) => {
  try {
    const range = Array.isArray(req.query.range)
      ? req.query.range[0]
      : req.query.range;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    // console.log(range, page);

    const intervalMap = {
      "1h": 1 * 60 * 60 * 1000,
      "1d": 24 * 60 * 60 * 1000,
      "1w": 7 * 24 * 60 * 60 * 1000,
      "1m": 30 * 24 * 60 * 60 * 1000,
    };

    const selectedRange = intervalMap[range] || intervalMap["1d"];
    const since = new Date(Date.now() - selectedRange);

    // Get total count of distinct player IDs in the review range
    const totalPlayersResult = await prisma.review.groupBy({
      by: ["player_id"],
      where: {
        created_at: {
          gte: since,
        },
      },
    });

    const totalPlayers = totalPlayersResult.length;
    const totalPages = Math.ceil(totalPlayers / pageSize);

    // Get paginated player_ids sorted by review count
    const reviewGroups = await prisma.review.groupBy({
      by: ["player_id"],
      where: {
        created_at: {
          gte: since,
        },
      },
      _count: {
        player_id: true,
      },
      _min: {
        created_at: true, // earliest review time for tie-breaker
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

    // Maintain correct order (based on reviewGroups)
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

    const link =
      region === "NA"
        ? `https://www.nexon.com/api/maplestory/no-auth/v1/ranking/na?type=overall&id=weekly&reboot_index=0&page_index=1&character_name=${name}`
        : `https://www.nexon.com/api/maplestory/no-auth/v1/ranking/eu?type=overall&id=weekly&reboot_index=0&page_index=1&character_name=${name}`;

    const { data } = await axios.get(link);

    // console.log(data);

    if (data.totalCount === 0) {
      return res.status(500).json("Something went wrong. Please try again.");
    }

    const character = data.ranks[0];
    const characterName = character.characterName;
    const level = character.level;
    const characterImgURL = character.characterImgURL;
    let server = character.worldName;
    let jobName = character.jobName;
    const jobDetail = character.jobDetail;

    if (server === "Kronos") {
      server = "Reboot Kronos";
    }

    if (server === "Hyperion") {
      server = "Reboot Hyperion";
    }

    if (jobName === "Warrior") {
      if (jobDetail === 12) {
        jobName = "Hero";
      }
      if (jobDetail === 22) {
        jobName = "Paladin";
      }
      if (jobDetail === 32) {
        jobName = "Dark Knight";
      }
    }

    if (jobName === "Magician") {
      if (jobDetail === 12) {
        jobName = "Fire Poison Archmage";
      }
      if (jobDetail === 22) {
        jobName = "Ice Lightning Archmage";
      }
      if (jobDetail === 32) {
        jobName = "Bishop";
      }
    }

    if (jobName === "Thief") {
      if (jobDetail === 12) {
        jobName = "Night Lord";
      }
      if (jobDetail === 22) {
        jobName = "Shadower";
      }
    }

    if (jobName === "Bowman") {
      if (jobDetail === 12) {
        jobName = "Bowmaster";
      }
      if (jobDetail === 22) {
        jobName = "Marksman";
      }
    }

    if (jobName === "Pirate") {
      if (jobDetail === 12) {
        jobName = "Buccaneer";
      }
      if (jobDetail === 22) {
        jobName = "Corsair";
      }
      if (jobDetail === 32) {
        jobName = "Cannon Master";
      }
    }

    const jobInformation = getJobCategory(jobName);
    // console.log(jobName);
    // console.log(jobInformation);
    // console.log(characterName);
    // console.log(level);
    // console.log(characterImgURL);
    // console.log(worldName);

    let player = await prisma.player.findUnique({
      where: {
        current_name_lower: name.toLowerCase(),
        region: region,
      },
    });

    if (player) {
      if (
        player.server === server &&
        player.branch === jobInformation.branch &&
        level >= player.level
      ) {
        const updatedPlayer = await prisma.player.update({
          data: {
            level: Number(level),
            archetype: jobInformation.archetype,
            job: jobName,
            avatar: characterImgURL,
          },
          where: {
            id: player.id,
          },
        });

        return res.send(updatedPlayer);
      }
    } else {
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

      return res.send(newPlayer);
    }

    res.send(data);
  } catch (error) {
    return res.status(500).json("Something went wrong. Please try again.");
  }
});

module.exports = router;
