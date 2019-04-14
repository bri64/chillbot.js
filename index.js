const Config = require("./config");
const Discord = require("discord.js");
const Client = new Discord.Client();
const ClientHandler = new (require("./components/client-handler"))(Client, Config.tokens.discord);
const MusicManager = new (require("./components/music-manager"))(Client, Config.tokens.youtube);
const EventListener = new (require("./components/event-listener"))(Client, MusicManager);

ClientHandler.setup().then((result) => {
    console.info(result);
    afterReady();
}).catch((error) => {
    console.error(error.message);
});

let afterReady = () => {
    EventListener.init();
};