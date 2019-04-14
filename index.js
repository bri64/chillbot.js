const Discord = require("discord.js");
const Client = new Discord.Client();
const Config = require("./config");
const ClientHandler = new (require("./components/client-handler"))(Client, Config.tokens.discord);
const EventListener = new (require("./components/event-listener"))(Client);

ClientHandler.setup().then((result) => {
    console.info(result);
    afterReady();
}).catch((error) => {
    console.error(error.message);
});

let afterReady = () => {
    EventListener.init();
};
