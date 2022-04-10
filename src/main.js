const Eris = require("eris");
const dotenv = require("dotenv");
const jsoning = require("jsoning");
const pluris = require("pluris");
const config = require("./config");
const prettyMS = require("pretty-ms");

// initiate json base
let db = new jsoning(`./db/db.json`);

dotenv.config();

const client = new Eris.Client(String("Bot" + process.env["DISCORD_BOT_TOKEN"]), {
  intents: Eris.Constants.Intents.guilds | Eris.Constants.Intents.guildMessages,
  messageLimit: 0,
  restMode: true
});

pluris(Eris, {
  awaitMessages: false,
  awaitReactions: false,
  createDMMessage: false,
  embed: true,
  endpoints: false,
  messageGuild: false,
  roleList: false,
  webhooks: false
});

const embed = new Eris.RichEmbed().setColor(0x7289DA).setTitle("Last Fap");
const buttonCustomID = "relapsed_fap_btn";

client.on("ready", async () => {
  let lastEmbed = await db.get("lastEmbed");
  if (!lastEmbed.channelID || !lastEmbed.messageID) {
    // the longest zero relapse
    let lastStreak = await db.get("lastStreak");
    
    // when you click the button, it grabs your last relapsed date
    let lastRelapse = await db.get("lastRelapse");

    if (!lastStreak) {
      let newRelapse = Date.now();
      await db.set("lastRelapse", newRelapse);
      lastRelapse = newRelapse;
    };
    
    if (!lastStreak) {
      let newStreak = Date.now();
      await db.set("lastStreak", newStreak);
      lastStreak = newStreak;
    };

    embed
    .addField("Last Streak", `<t:${Math.round(Number(lastStreak) / 1000)}:R>`)
    .addField("Last Relapse", `<t:${Math.round(Number(lastRelapse) / 1000)}:F>`);

    try {
      await client.createMessage(config.channelID, {
        embeds: [embed],
        components: [
          {
            type: Eris.Constants.ComponentTypes.ACTION_ROW,
            components: [{
              type: Eris.Constants.ComponentTypes.BUTTON,
              style: Eris.Constants.ButtonStyles.DANGER,
              custom_id: buttonCustomID,
              label: "Relapse/Reset Streak"
            }]
          }
        ]
      })
    } catch (error) {
      return console.error(error);
    };
  };
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  // defer + ephemeral
  await interaction.defer(64);

  // must be button
  if (
    interaction instanceof Eris.ComponentInteraction &&
    interaction.data.component_type == Eris.Constants.ComponentTypes.BUTTON &&
    interaction.data.custom_id == buttonCustomID
  ) {
    let lastStreak = await db.get("lastStreak");
    let lastRelapse = await db.get("lastRelapse");

    // set new relapse
    await db.set("lastRelapse", Date.now());

    // set new streak
    if (Number(lastRelapse - Date.now()) >= Number(lastStreak)) {
      // set a new record
      await db.set("lastStreak", Number(lastRelapse - Date.now()));
    };

    return interaction.createMessage("Relapsed.");
  };
});

client.connect();