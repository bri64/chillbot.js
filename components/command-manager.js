const PlayCommand = require("./commands/play");

const PingCommand = require("./commands/ping");
const CoinCommand = require("./commands/coin");
const ErrorCommand = require("./commands/error");

class CommandManager {
    constructor(client, musicManager) {
        this.client = client;
        this.musicManager = musicManager;
    }

    parseCommand(msg) {
        let message = msg.content;
        if (message[0] === "!") {
            let args = message.slice(1, message.length).split(" ");
            let commandName = args[0];
            args = args.slice(1, args.length);

            try {
                let command;
                switch (commandName.toUpperCase()) {
                    case "PLAY":
                        command = new PlayCommand({
                            musicManager: this.musicManager,
                            member: msg.member,
                            channel: msg.channel,
                            url: args[0]
                        });
                        break;
                    case "PING":
                        command = new PingCommand({ channel: msg.channel });
                        break;
                    case "COIN":
                        command = new CoinCommand({ channel: msg.channel });
                        break;
                    default:
                        command = new ErrorCommand({ channel: msg.channel });
                        break;
                }
                command.execute();
            } catch (e) {
                console.error(e);
                new ErrorCommand({ channel: msg.channel }).execute();
            }
        }
    }
}

module.exports = CommandManager;