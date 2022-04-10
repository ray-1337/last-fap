const Eris = require("eris");
const dotenv = require("dotenv");
const jsoning = require("jsoning");

// initiate json base
let db = new jsoning(`./db/db.json`);

dotenv.config();

const bot = new Eris(String("Bot" + process.env["DISCORD_BOT_TOKEN"]), {
  intents: Eris.Constants.Intents.guilds | Eris.Constants.Intents.guildMessages,
  messageLimit: 0,
  restMode: true
});

bot.on("ready", () => {
  console.log("Ready!");
});

bot.connect();