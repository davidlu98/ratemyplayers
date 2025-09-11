// prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const playerData = {
  0: {
    current_name: "Bane",
    current_name_lower: "bane",
    region: "NA",
    server: "Bera",
    level: 295,
    archetype: "Resistance",
    branch: "Warrior",
    job: "Demon Slayer",
    avatar:
      "https://msavatar1.nexon.net/Character/CECMCMDMAKIMDJOODICACKJFLKOLBLPFMCNCFBEMGLAAPKIFONADFMCCBMBKONNBHNIPFOMBMBOMILPOEHPMJLLMFODLLIJPLCCDJJHMNONIONFGGMDEMECNAMEMDGNBBFKGPOGABECBBOCDKJOKGFNDAKKOGNPILCJPJAKBPCBHPHKDCHMAGPJIBBDCHHMCLNEGANMFGCKHLOHAAPKELHGDANAJBKKLFEKDEAECECMBNLOMFGJCANCHANEFLDNK.png",
  },
  1: {
    current_name: "Aizen",
    current_name_lower: "aizen",
    region: "NA",
    server: "Reboot Hyperion",
    level: 290,
    archetype: "Sengoku",
    branch: "Warrior",
    job: "Hayato",
    avatar:
      "https://msavatar1.nexon.net/Character/DGNKNJKIJLOHDCGJEOIDJBANPMEIDGLHPLFBPPEKEMPCEGNCAABAPDMJMOMIJAAMAEMJMABAKOKMHBINDAMHIGDLDEEADJEMKJIFGPHJPEDPKLGANOCLNBCBLMHDKFJODEFINLOFIECAKKNNPDBFCOKAFJMLMGCJONEBALOEFJICAFKIHOEIIOPJCFDGDMMOPGBBIEGOCDDCCIDKCMIJOGGIDPDBHNGPKONANKLFGCEDOHOBPPPPMBHNICLBFACN.png",
  },
  2: {
    current_name: "Alaska",
    current_name_lower: "alaska",
    region: "NA",
    server: "Bera",
    level: 291,
    archetype: "Hero",
    branch: "Warrior",
    job: "Aran",
    avatar:
      "https://msavatar1.nexon.net/Character/CKMAAABBGFPJAEOPEEHBOPIHNGAHIFHHPFPKKIPKABPGKOEIAELJMBOMOKHKCPGGKBMOHGMPEMHPKLLPHGKNIFKLACNAGKMENJAJIMHJODPOJPJOKLFKDELDACGGGGFFKBCFLIPPLMOIALAFOLDMLHDEMELAEIFHELCIEKBAHGAGGAOGNKAJPOFLNAGBPMFBALEEGIBKEHLMNILMHJAFONHILLFOPJMOGDEEGFNOBKOPJBJABMMEAHDHBNKFKNEM.png",
  },
  3: {
    current_name: "Alucardll",
    current_name_lower: "alucardll",
    region: "NA",
    server: "Scania",
    level: 295,
    archetype: "Explorer",
    branch: "Mage",
    job: "Fire Poison Archmage",
    avatar:
      "https://msavatar1.nexon.net/Character/OOBHOKHKPCALLDMABDHCAOCFLEIKGFBBOCAIDBFOGJJGAGFJBKNKKJCOECLKADDDMAGFOAFCDBMPHCLJGPDOLJNICNOKPPNOECOEIJNGAMNEJKFNEDLDHCDGEGDAOMFNFLJLOFNFBEJAIOJPNLDHLKKEONOEMJJACKDOMHNCNNLKGFEPDIOGCNNPIBLPOKFOIOAGAKKJBGFLNJLCHPDEDDIELEJJKMDCGAJBCNJHKKPJCGMLLAHJMCKPACFIBHFF.png",
  },
  4: {
    current_name: "BugTamer",
    current_name_lower: "bugtamer",
    region: "EU",
    server: "Reboot Solis",
    level: 291,
    archetype: "Jianghu",
    branch: "Mage",
    job: "Lynn",
    avatar:
      "https://msavatar1.nexon.net/Character/OHAPJKEKCGBHNBCMALKNKNDJOMHEOIMJOIJNNIIKMDMILGOKNCCCIBMDGKMFJNPEMBGDPBHHLIBDJIMEPPCPGLKPBAGHLIPFLMJJHDBCDGPJGOLLOHPNMEBGBOBOJPBONIELLEAKAIGNJDDOBNEALHAGEGLILHADFKIJFNKOJIMENHEEOEFFCDDEHMJODIDKFGMOPINLJCAMKHOOKGHEPJFNKGGEKCJHJBOHHEIPGNNAHHMKFDABPOGBAEDLGLFN.png",
  },
  5: {
    current_name: "Carol",
    current_name_lower: "carol",
    region: "NA",
    server: "Bera",
    level: 286,
    archetype: "Herp",
    branch: "Pirate",
    job: "Shade",
    avatar:
      "https://msavatar1.nexon.net/Character/JBEBLDMNCPOMIAFMDAKLMOIKHENILNLBLADNKGKDEEAMPLEMPFHCJNPEOEHHKALJCFGCHDPDCEANLIHBIHHDEKNIILKDLLMOBPHDLLFKECCEIGHODELHOMMNHCPEDHEKBIGHPAHNKPGFHCFFKNGLEEKJKNIJPGNHGLIILAAJNAGLELKNEBHMOFEJCJGFFGFMHFIDCCJIHBECLJMINLMEPFHADFHGJLODCLMFHJIANCKBAIDEJKNEEPCNLDLNDBKD.png",
  },
  6: {
    current_name: "Dark",
    current_name_lower: "dark",
    region: "NA",
    server: "Reboot Kronos",
    level: 296,
    archetype: "Explorer",
    branch: "Warrior",
    job: "Hero",
    avatar:
      "https://msavatar1.nexon.net/Character/PECBPKBJIOALNFJCNPCCAEDBENBOKPMBPJBLKDENFJNFKCNLGAPCILPHJDENEJJMKKLLICJGGFAOLCPCIDBGKCMIKGPFEBCNGIEBLFHJJCCAMLKDONCJNNEBIPCFPFGBOOKHEHFIGGDHHICEDCKOBPDOEPJELGNMBDGJDELBDKDOBLDBFHHMJHCCIFFEGNIGMCKECMPCPCFPJCKODHOEMLLIMAOOPNCMONKHNLEMFLEDOEGKNDKHELJDEBPBIHMG.png",
  },
  7: {
    current_name: "DonutChief",
    current_name_lower: "donutchief",
    region: "NA",
    server: "Bera",
    level: 300,
    archetype: "Resistance",
    branch: "Mage",
    job: "Battle Mage",
    avatar:
      "https://msavatar1.nexon.net/Character/ABCJENOGOGEENPONIDKAONNHCOGFNNOPIAJHGCOMIJOLGFGLJMNOPIJODIBKJFBDMJPBIPPGDEECMFBLBFJCBCGLDIAMLAILAIEJHIICJNIBINEJDPCJPFFMAPEJINDLIKMNLLMIDBCIGGKDEGCOCIPMAJFIHFPGEMPCHAFNOHDOCBFFALJPFLOPIIHCNEMHCMHGEBMAOJAKMEDOENMCPEFDNKPBOKAPDKDKOOOMLCOLKKHHADKBAAKGIJKPKICI.png",
  },
  8: {
    current_name: "Niru",
    current_name_lower: "niru",
    region: "NA",
    server: "Bera",
    level: 300,
    archetype: "Explorer",
    branch: "Mage",
    job: "Bishop",
    avatar:
      "https://msavatar1.nexon.net/Character/DDBGPLFFKBPLEHKNOBNMHCKKNIKKLLBNKCPGKHKNPLNEPPNLHGMBBPFOKKAOHAMGALDLIBMNDJKIHHKFHFEFAIHNHOOFCEPDPAMIPLHHNIHANAPMABBHOOGIFBOKMEMDHLFCLNBMMBKPHCIJEDPMLBPLADCEGMKDAKIFMHOBKAEMOAGEFJDHOLOJACDPAOFMNCBDADJGHIDCADCGMCMKCNHMFHNLDBKKBBFLEOJBDKKPMBMDGNHGDEADOIPEGAMH.png",
  },
  9: {
    current_name: "SuriClone",
    current_name_lower: "suriclone",
    region: "NA",
    server: "Reboot Hyperion",
    level: 290,
    archetype: "Explorer",
    branch: "Thief",
    job: "Dual Blade",
    avatar:
      "https://msavatar1.nexon.net/Character/OENCDKFHLABOHILICPGBLDCFFJMNCNHFLOOPJDAEGMMPEBFEKDKDBDCAJCEAJEDBIFLPJAOJJANHDKHNEDJCJAJBHIOMEBGBBOMPGAEIBMPIJJOEAAGNDMEGEGCBGGJKLAEPPADCIOHGKAIEEJCBIPHBJIFNHOPMIDCCINJEEFCLKLNCAICCOJDLNDJDOAIGIFOBHGNKDCNFGOAIHDKIOJMGNEIMMLKPPKDCJIEFCGAAMGJGPMEPBDIHMFINCIGO.png",
  },
  10: {
    current_name: "Asians",
    current_name_lower: "asians",
    region: "NA",
    server: "Bera",
    level: 292,
    archetype: "Resistance",
    branch: "Mage",
    job: "Battle Mage",
    avatar:
      "https://msavatar1.nexon.net/Character/MPNAHELCDGCCDHGODFIJHOHAFFCHOICFJMPLPCKOAIHMMCLFLLHHGIOCCOJLIPECPAKDIBECOHLGDJPNHPLJFMDGDFBIJEDBBPGLNMPONIGOBHGOELCLEDFPBKHKNNHGJJHDMCICCFKEFBHFEBHKCPFPNCPIFBCKIONLNHJPMPLGEOHKGELDKEINMCLLFFGGGAIEEMADKBCFDCOHNKNPCOLJLJMEGOFAGOPJLOGGBDMOOBGEFNGAEKABCNNCLCED.png",
  },
  11: {
    current_name: "Nerf",
    current_name_lower: "nerf",
    region: "EU",
    server: "Luna",
    level: 297,
    archetype: "Explorer",
    branch: "Pirate",
    job: "Buccaneer",
    avatar:
      "https://msavatar1.nexon.net/Character/DMIBIOLHNHMPDDDOFENBHFNDOKKBJDDLLMGOINMOGLOIFEEAJDPPIEKJACKDKKGMGJMOHCGPHJELEAEAEHALAHOHBELGJDBIDLGMHCNJCJJMPIKECNMMEPFNDBNHIFCMEJPHMMMKIJNLGNGCDIGJKLDOGDIENDEBFEJENLOJICJBHIBBNJGGFLDHKFDJNAKHPHDDJNAIAHFLLDHGKBDNFMKKMJKNEDHBNCAMDCMKBDIOEMOICDONGMEFBHOEMJDH.png",
  },
  12: {
    current_name: "Pekay",
    current_name_lower: "pekay",
    region: "NA",
    server: "Bera",
    level: 293,
    archetype: "Hero",
    branch: "Archer",
    job: "Mercedes",
    avatar:
      "https://msavatar1.nexon.net/Character/BFECMLIGJIOCLHOOEMCLMEFJDIBKHFILOEGEFHPFINIOPJBPBJDIAMEFDDMJLLKEJMCCHGPOIBENCGLACDNGICMALHLKMDKLJBFIHPPJPBINDCCBFDACAKPHKGFLLHJPGPKPLEFHHEFOBPPBPOLMLMGIIODNAFPAKIBDGBCCKHAJDFCLHNEGCEGFNLEFNLEFJKNPNEOMEMHNNOLLBEPOLDELCDDELAAIDJENPMKPGNEHANIGGJMLHBCAGCDGHJGL.png",
  },
  13: {
    current_name: "Shapaz",
    current_name_lower: "shapaz",
    region: "NA",
    server: "Reboot Kronos",
    level: 295,
    archetype: "Cygnus",
    branch: "Thief",
    job: "Night Walker",
    avatar:
      "https://msavatar1.nexon.net/Character/JKKDIOBCKBEGOJAICLKOCAAFEGMLGDNHLIJADJNCPKFAOHMJEDFIJBKOGMJMILOGFEEDDKFGKEGDCMBDGMDGOMCAPHKKODHDKINPGIMIIGFEHDCOJDHMHAGICAIMOHKPMPALAHKGINOOBOCOLAJIGBLJEPAHLCIPLMFCKNMAKFOFCMEECFHAMKNCBHNHFOOBAEIMIEALLBGJDKOHKFFBPCPPNGMFFKBIPNANFDLIDFNOIHJHJEIOHIOFKAMGHJHI.png",
  },
  14: {
    current_name: "Bowozo",
    current_name_lower: "bowozo",
    region: "NA",
    server: "Reboot Kronos",
    level: 276,
    archetype: "Explorer",
    branch: "Archer",
    job: "Bowmaster",
    avatar:
      "https://msavatar1.nexon.net/Character/GLMGPEGMOHIHINNPGDGIMMINPELJNMCONFOAJPLCHCGANNCIEDCFBKDJBJAJLKKPAPDOJGMNKELLNPDEJHELHOOEJPFGHNJBCKILLPFOLPBDEPGGIGOJMKCLDCCDBEGDJIGDMOGMGMJIAKJCCCCGNICLJCHNEOFODGBMGJCNJIDPBANDPOHKIOPMIIPNBNBJJJALNDFJNLILLLBMIGGANBEAPHICPENKKDJEDIEMFKLNPEJDHNCCIAHEGCOGHGIO.png",
  },
  15: {
    current_name: "MitShot",
    current_name_lower: "mitshot",
    region: "NA",
    server: "Bera",
    level: 294,
    archetype: "Explorer",
    branch: "Archer",
    job: "Bowmaster",
    avatar:
      "https://msavatar1.nexon.net/Character/IPNNFMAHHMGNLOMBJLMOAKJAOHPNMDHFDDOBFANBLPMGPALKHBFFEBHJNGBAFEMJFJICJOJHJIBPCILFEOKMNCHOFDBOEPLKLFHKLFKDFIMLCMBOEDDDGJNENHICAADKLELLBLFLPLEBABHLGNBANKEPHHLCBLNGBMBKMFDFLDBDDGPLCFDPCCMCGHHBLJBBIGLLPKJHPFGLDFPFJOAEEDLJJNLJFCMKLHHIAOIAFMOBJFIALPJEFPHACDJFNABD.png",
  },
  16: {
    current_name: "Zerk",
    current_name_lower: "zerk",
    region: "NA",
    server: "Bera",
    level: 295,
    archetype: "Explorer",
    branch: "Warrior",
    job: "Hero",
    avatar:
      "https://msavatar1.nexon.net/Character/ENOCNHDLNMGGGDLGLOPLDJPODDFNOLFIJOONLECEHJKEJPNBDPGFBNJFIGCNDJNKKCOKOGPDNEMAMLMLEILFIJGKEJIPJJJCMMOBKELOEOFIPFHNFHNEIEGBFODNKBMLACILGBCOHAABGHPLJBOMKCNLNBGGBHEDBLEDGCFDOGNIFIPPMAFHDMCJMAMJMHFLGILDGJKFAFBGJHMANIPKGBBFMMMJAEHLEIAPPMMBPFPPJLNFCECFLLMAGGPCFHDG.png",
  },
  17: {
    current_name: "Jake",
    current_name_lower: "jake",
    region: "NA",
    server: "Scania",
    level: 120,
    archetype: "Cygnus",
    branch: "Pirate",
    job: "Thunder Breaker",
    avatar:
      "https://msavatar1.nexon.net/Character/BJBFNEMGOHNFEKIMOFBBBOODEMBKDEAJAFPACFOFAJBBFBLHCMDGFLHBBMBJHMEHLJDODOHBFKJKHDMJJMGJBLFNGEAAFMCEGDNKNBPJCGKOLKIGEBOKGMNBBOPKDPKFJGAGPLFHBGAFKJCEBCONIDDFBEDBPDCOPFOENHEOPICCPJHKGBMAPFGLPMJPOBJOOPCDJBLIJFHKNFMAEPGFCLLCOINFPIGOAKGHCOMHBNBFHEKAPLBIJFOFEGNLDNPN.png",
  },
  18: {
    current_name: "Gamer",
    current_name_lower: "gamer",
    region: "NA",
    server: "Bera",
    level: 290,
    archetype: "Explorer",
    branch: "Thief",
    job: "Night Lord",
    avatar:
      "https://msavatar1.nexon.net/Character/NJHNCGIDCCAAKGHHDCBLIJEBBDOPLAEPGOAODFPPEKOAAKCEHFGOKOPEPHFFCODAFFAAIPEOCJABIGIBGBJLPEHLFEGKGHMMLJMDLLLGLEGOHGGPLKJONNMEHDBGBFDJGGDJICNMHOHIBFMNCKAJLAEMLPGJMAKGCKMOOIJOBEKIFFINJGCFEKBMAACEPJLDEGFAGILDAKAEABDGPMDIIMJNBBOLFJEIFFIGDBMOOBCIBKKJPCKCJINOJIKHLMCI.png",
  },
  19: {
    current_name: "4EvarANubie",
    current_name_lower: "4evaranubie",
    region: "NA",
    server: "Bera",
    level: 290,
    archetype: "Explorer",
    branch: "Mage",
    job: "Bishop",
    avatar:
      "https://msavatar1.nexon.net/Character/JMPLPAOAKHANEKADDGGBKJBPNCIKCIIGHKMLHFDMKKANHAGNJJDKAMEHDGJMDEMEAOODIDLLCDAHJDPEEFOPMKFEGHCMKDEEIJDNEFPIBMOJCGHDKNBCGOJFLPJJANJGLAIHADABGIPDHAPDJMMBLNGEMNOCCDNCDGJAOLAFDEFJBFDHNBIJFEGCGELJDHBMGIJIBLKFBLBLLCNJAEODIFJMKLBLHADMJGONHMAHCHKHIMPOEGMHPKNLJDGLNOCF.png",
  },
};

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

    let newPlayer = await prisma.player.create({
      data: {
        current_name: playerData[i].current_name,
        current_name_lower: playerData[i].current_name_lower,
        region: playerData[i].region,
        server: playerData[i].server,
        level: playerData[i].level,
        archetype: playerData[i].archetype,
        branch: playerData[i].branch,
        job: playerData[i].job,
        avatar: playerData[i].avatar,
      },
    });

    let firstReview = await prisma.review.create({
      data: {
        user_id: userAccount.id,
        player_id: newPlayer.id,
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

    newPlayer = await prisma.player.create({
      data: {
        current_name: playerData[i + 10].current_name,
        current_name_lower: playerData[i + 10].current_name_lower,
        region: playerData[i + 10].region,
        server: playerData[i + 10].server,
        level: playerData[i + 10].level,
        archetype: playerData[i + 10].archetype,
        branch: playerData[i + 10].branch,
        job: playerData[i + 10].job,
        avatar: playerData[i + 10].avatar,
      },
    });

    secondReview = await prisma.review.create({
      data: {
        user_id: userAccount.id,
        player_id: newPlayer.id,
        rating: Math.floor(Math.random() * 3) + 3,
        comment: reviewMessages[i],
      },
    });

    await prisma.vote.create({
      data: {
        user_id: userAccount.id,
        review_id: secondReview.id,
        value: 1,
      },
    });

    await prisma.review.update({
      where: {
        id: secondReview.id,
      },
      data: {
        upvotes: 1,
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
