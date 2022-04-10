const Eris = require("eris");
const dotenv = require("dotenv");
const jsoning = require("jsoning");
const pluris = require("pluris");

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

client.on("ready", () => {
  console.log("Ready!");
});

client.connect();