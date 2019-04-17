const fs = require("fs");
const Config = require("./config");

let command_prefix = "!";
let discord_token = Config.tokens.discord;
if (process.argv.length > 2 && process.argv[2] === "test") {
    command_prefix = "~";
    discord_token = Config.tokens.discord_test;
}

const Discord = require("discord.js");
const Client = new Discord.Client();
const ClientHandler = new (require("./src/client-handler"))(Client, discord_token);
const MusicManager = new (require("./src/music-manager"))(Client, Config.tokens);
const CommandManager = new (require("./src/command-manager"))(MusicManager, command_prefix);
const EventListener = new (require("./src/event-listener"))(Client, MusicManager, CommandManager);

ClientHandler.setup()
    .then((result) => {
        console.info(result);
        afterReady();
    })
    .catch((error) => {
        console.error(error.message);
    });

let afterReady = () => {
    EventListener.init();
    CommandManager.loadCommands(fs);
};

process.on('SIGINT', async () => {
   console.info("Shutting down...");
   await MusicManager.shutdown();
   console.info("Goodbye!");
   process.exit(0);
});
