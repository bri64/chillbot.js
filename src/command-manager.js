/* Voice Commands */
const PlayCommand = require("./commands/play");
const PauseCommand = require("./commands/pause");
const NextTrackCommand = require("./commands/next");
const PrevTrackCommand = require("./commands/prev");
const SeekCommand = require("./commands/seek");
const ShuffleCommand = require("./commands/shuffle");
const KillCommand = require("./commands/kill");
const SearchCommand = require("./commands/search");

/* Misc Commands */
const PingCommand = require("./commands/ping");
const CoinCommand = require("./commands/coin");
const ErrorCommand = require("./commands/error");

class CommandManager {
    constructor(musicManager) {
        this.musicManager = musicManager;
        this.commands = [];
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
                            msg,
                            musicManager: this.musicManager,
                            instant: true,
                            url: args[0]
                        });
                        break;

                    case "ADD":
                    case "QUEUE":
                        command = new PlayCommand({
                            msg,
                            musicManager: this.musicManager,
                            instant: false,
                            url: args[0]
                        });
                        break;

                    case "UNPAUSE":
                    case "RESUME":
                    case "PAUSE":
                        command = new PauseCommand({
                            msg,
                            musicManager: this.musicManager,
                        });
                        break;

                    case "SKIP":
                    case "NEXT":
                        command = new NextTrackCommand({
                            msg,
                            musicManager: this.musicManager
                        });
                        break;

                    case "BACK":
                    case "PREV":
                        command = new PrevTrackCommand({
                            msg,
                            musicManager: this.musicManager
                        });
                        break;

                    case "YOUTUBE":
                    case "LOOKUP":
                    case "SEARCH":
                        command = new SearchCommand({
                            msg,
                            musicManager: this.musicManager,
                            query: args.join(" ")
                        });
                        break;

                    case "STOP":
                    case "KILL":
                        command = new KillCommand({
                            msg,
                            musicManager: this.musicManager
                        });
                        break;

                    case "PING":
                        command = new PingCommand({
                            msg
                        });
                        break;

                    case "HEADS":
                    case "TAILS":
                    case "FLIP":
                    case "COIN":
                        command = new CoinCommand({
                            msg
                        });
                        break;

                    case "SEEK":
                    case "FIND":
                    case "GOTO":
                        command = new SeekCommand({
                            msg,
                            musicManager: this.musicManager,
                            query: args.join(" ")
                        });
                        break;

                    case "RANDOM":
                    case "SHUFFLE":
                        command = new ShuffleCommand({
                            msg,
                            musicManager: this.musicManager
                        });
                        break;

                    default:
                        let otherCmd = this.commands[commandName.toUpperCase()];
                        if (otherCmd) {
                            command = new PlayCommand({
                                msg,
                                musicManager: this.musicManager,
                                url: otherCmd
                            });
                        } else {
                            command = new ErrorCommand({
                                msg,
                                error: "Unknown command!"
                            });
                        }
                        break;
                }
                command.execute();
            } catch (e) {
                console.error(e);
                new ErrorCommand({
                    msg,
                    error: "An unknown error occurred!"
                }).execute();
            }
        }
    }

    loadCommands(fs) {
        let contentsJSON = fs.readFileSync("./src/commands/cmd-db.json");
        this.commands = JSON.parse(contentsJSON);
    }
}

module.exports = CommandManager;