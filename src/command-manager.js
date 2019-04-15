class CommandManager {
    constructor(musicManager) {
        this.musicManager = musicManager;
        this.commands = [];
    }

    async parseCommand(msg) {
        let message = msg.content;
        if (message[0] === "!") {
            let args = message.slice(1, message.length).split(" ");
            let commandName = args[0];
            args = args.slice(1, args.length);

            try {
                let command;
                switch (commandName.toUpperCase()) {
                    case "PLAY":
                        command = new Commands.PlayCommand({
                            msg,
                            musicManager: this.musicManager,
                            instant: true,
                            url: args[0]
                        });
                        break;

                    case "ADD":
                    case "QUEUE":
                        command = new Commands.PlayCommand({
                            msg,
                            musicManager: this.musicManager,
                            instant: false,
                            url: args[0]
                        });
                        break;

                    case "UNPAUSE":
                    case "RESUME":
                    case "PAUSE":
                        command = new Commands.PauseCommand({
                            msg,
                            musicManager: this.musicManager,
                        });
                        break;

                    case "SKIP":
                    case "NEXT":
                        command = new Commands.NextTrackCommand({
                            msg,
                            musicManager: this.musicManager
                        });
                        break;

                    case "BACK":
                    case "PREV":
                        command = new Commands.PrevTrackCommand({
                            msg,
                            musicManager: this.musicManager
                        });
                        break;

                    case "YOUTUBE":
                    case "LOOKUP":
                    case "SEARCH":
                        command = new Commands.SearchCommand({
                            msg,
                            musicManager: this.musicManager,
                            query: args.join(" ")
                        });
                        break;

                    case "SEEK":
                    case "FIND":
                    case "GOTO":
                        command = new Commands.SeekCommand({
                            msg,
                            musicManager: this.musicManager,
                            query: args.join(" ")
                        });
                        break;

                    case "RANDOM":
                    case "SHUFFLE":
                        command = new Commands.ShuffleCommand({
                            msg,
                            musicManager: this.musicManager
                        });
                        break;

                    case "SETSHUFFLE":
                    case "SHUFFLETOGGLE":
                    case "TOGGLESHUFFLE":
                        command = new Commands.ToggleShuffleCommand({
                            msg,
                            musicManager: this.musicManager,
                            shuffle: args[0]
                        });
                        break;

                    case "VOL":
                    case "MUTE":
                    case "SETVOLUME":
                    case "VOLUME":
                        command = new Commands.VolumeCommand({
                            msg,
                            musicManager: this.musicManager,
                            volume: args[0]
                        });
                        break;

                    case "SONG":
                    case "NOWPLAYING":
                    case "CURRENT":
                        command = new Commands.CurrentCommand({
                            msg,
                            musicManager: this.musicManager
                        });
                        break;

                    case "STATUS":
                    case "PLAYLIST":
                        command = new Commands.StatusCommand({
                            msg,
                            musicManager: this.musicManager
                        });
                        break;

                    case "STOP":
                    case "KILL":
                        command = new Commands.KillCommand({
                            msg,
                            musicManager: this.musicManager
                        });
                        break;

                    case "PING":
                        command = new Commands.PingCommand({
                            msg
                        });
                        break;

                    case "HEADS":
                    case "TAILS":
                    case "FLIP":
                    case "COIN":
                        command = new Commands.CoinCommand({
                            msg
                        });
                        break;

                    default:
                        let otherCmd = this.commands[commandName.toUpperCase()];
                        if (otherCmd) {
                            command = new Commands.PlayCommand({
                                msg,
                                musicManager: this.musicManager,
                                url: otherCmd
                            });
                        } else {
                            command = new Commands.ErrorCommand({
                                msg,
                                error: "Unknown command!"
                            });
                        }
                        break;
                }
                await command.execute();
            } catch (e) {
                console.error(e);
                new Commands.ErrorCommand({
                    msg,
                    error: "An unknown error occurred!"
                }).execute();
            }
        }
    }

    loadCommands(fs) {
        // Dynamically load commands from ./commands
        Commands = Object.values((require('require-all')(__dirname + '/commands')))
            .reduce((tmp, item) => ({ ... tmp, ...item }));

        // Load pre-defined commands
        const definedCommands = "cmd-db.json";
        const contentsJSON = fs.readFileSync(`./src/commands/${definedCommands}`);
        this.commands = JSON.parse(contentsJSON);
    }
}

let Commands = {};
module.exports = CommandManager;