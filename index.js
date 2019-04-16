const Config = require("./config");
const fs = require("fs");
const Discord = require("discord.js");
const Client = new Discord.Client();
const ClientHandler = new (require("./src/client-handler"))(Client, Config.tokens.discord);
const MusicManager = new (require("./src/music-manager"))(Client, Config.tokens);
const CommandManager = new (require("./src/command-manager"))(MusicManager);
const EventListener = new (require("./src/event-listener"))(Client, MusicManager, CommandManager);

process.on('SIGINT', async () => {
   console.info("Shutting down...");
   await MusicManager.shutdown();
   console.info("Goodbye!");
   process.exit(0);
});

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