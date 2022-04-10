const Eris = require("eris");
const dotenv = require("dotenv");
const jsoning = require("jsoning");
const pluris = require("pluris");
const config = require("./config");

// initiate json base
let db = new jsoning(`./db/db.json`);

dotenv.config();

const client = new Eris.Client(String("Bot" + process.env["DISCORD_BOT_TOKEN"]), {
  intents: Eris.Constants.Intents.guilds | Eris.Constants.Intents.guildMessages,
  messageLimit: 0,
  restMode: true
});

require("pluris")(Eris, {
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

client.on("ready", async () => {
  let lastEmbed = await db.get("lastEmbed");
  if (!lastEmbed.channelID || !lastEmbed.messageID) {
    // the longest zero relapse
    let lastStreak = await db.get("lastStreak");
    
    // when you click the button, it grabs your last relapsed date
    let lastRelapse = await db.get("lastRelapse");

    if (lastRelapse) {
      embed.addField("Last Relapse", `<t:${Math.round(Number(lastRelapse) / 1000)}:F>`);
    };
    
    if (lastStreak) {
      embed.addField("Last Streak", `<t:${Math.round(Number(lastStreak) / 1000)}:R>`);
    };

    try {
      await client.createMessage(config.channelID, {
        embeds: [embed],
        components: [
          {
            type: Eris.Constants.ComponentTypes.ACTION_ROW,
            components: [{
              type: Eris.Constants.ComponentTypes.BUTTON,
              style: Eris.Constants.ButtonStyles.DANGER,
              custom_id: "relapsed_fap_btn",
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

client.connect();