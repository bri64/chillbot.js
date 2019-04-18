class CommandManager {
    constructor(client, musicManager, prefix) {
        this.client = client;
        this.musicManager = musicManager;
        this.prefix = prefix;
        this.macroCommands = [];
    }

    async parseCommand(msg) {
        let command;
        let message = msg.content;
        let isMentioned = msg.isMentioned(this.client.user);
        if (isMentioned) {
            command = new Commands.HelpCommand({ Commands: Commands });
            await command.execute({
                msg,
                guild: msg.guild,
                Commands: Commands
            });
        } else if (message[0] === this.prefix) {
            let args = message.slice(1, message.length).split(" ");
            let commandName = args[0].toUpperCase();
            args = args.slice(1, args.length);

            try {
                for (let cmd of Object.keys(Commands)) {
                    let validCommand = Commands[cmd].aliases && Commands[cmd].aliases().includes(commandName);
                    if (validCommand) {
                        command = new Commands[cmd]();
                        break;
                    }
                }
                if (!command) {
                    let macroCommand = this.macroCommands[commandName];
                    if (macroCommand) {
                        command = new Commands.PlayCommand();
                        args = [ macroCommand ];
                    } else {
                        command = new Commands.ErrorCommand();
                        args = [ "Unknown Command" ];
                    }
                }
            } catch (e) {
                console.error(e);
                command = new Commands.ErrorCommand();
                args = [ "An unknown error occurred!" ];
            } finally {
                await command.execute({
                    msg,
                    guild: msg.guild,
                    musicManager: this.musicManager,
                    command: commandName,
                    Commands: Commands,
                    args
                });
            }
        }
    }

    loadCommands(fs) {
        // Load macro commands
        const definedCommands = "macros.json";
        const contentsJSON = fs.readFileSync(`./${definedCommands}`);
        this.macroCommands = JSON.parse(contentsJSON);

        // Dynamically load commands from ./commands
        let allCommands = Object.values((require('require-all')(__dirname + '/commands')));
        Commands = allCommands.reduce((tmp, item) => ({ ... tmp, ...item }));
    }
}

let Commands = {};
module.exports = CommandManager;