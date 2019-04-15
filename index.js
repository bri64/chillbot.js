const Config = require("./config");
const Discord = require("discord.js");
const Client = new Discord.Client();
const ClientHandler = new (require("./src/client-handler"))(Client, Config.tokens.discord);
const MusicManager = new (require("./src/music-manager"))(Client, Config.tokens);
const EventListener = new (require("./src/event-listener"))(Client, MusicManager);

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
};