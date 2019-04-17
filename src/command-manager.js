class CommandManager {
    constructor(client, musicManager, command_prefix) {
        this.client = client;
        this.musicManager = musicManager;
        this.prefix = command_prefix;
        this.commands = [];
    }

    async parseCommand(msg) {
        let message = msg.content;
        let isMentioned = msg.isMentioned(this.client.user);
        if (isMentioned || message[0] === this.prefix) {
            let args = message.slice(1, message.length).split(" ");
            let commandName = args[0].toUpperCase();
            args = args.slice(1, args.length);
            let command;

            try {

                if (isMentioned) {
                    command = new Commands.HelpCommand({ Commands: Commands });
                } else {
                    for (let cmd of Object.keys(Commands)) {
                        let validCommand = Commands[cmd].aliases && Commands[cmd].aliases().includes(commandName);
                        if (validCommand) {
                            // Help command is special
                            let isHelpCommand = Commands.HelpCommand.aliases().includes(commandName);
                            if (isHelpCommand) {
                                command = new Commands.HelpCommand({ Commands: Commands });
                            } else {
                                command = new Commands[cmd]();
                            }
                            break;
                        }
                    }
                    if (!command) {
                        let otherCmd = this.commands[commandName];
                        if (otherCmd) {
                            command = new Commands.PlayCommand();
                            args = [ otherCmd ];
                        } else {
                            command = new Commands.ErrorCommand();
                            args = [ "Unknown Command" ];
                        }
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
                    args
                });
            }
        }
    }

    loadCommands(fs) {
        // Load pre-defined commands
        const definedCommands = "cmd-db.json";
        const contentsJSON = fs.readFileSync(`./src/commands/${definedCommands}`);
        this.commands = JSON.parse(contentsJSON);

        // Dynamically load commands from ./commands
        let allCommands = Object.values((require('require-all')(__dirname + '/commands')));
        Commands = allCommands.reduce((tmp, item) => ({ ... tmp, ...item }));

        // Filter out invalid commands
        Object.keys(Commands)
            .filter(cmd => Object.keys(this.commands).includes(cmd))
            .forEach((cmd) => delete Commands[cmd]);

    }
}

let Commands = {};
module.exports = CommandManager;