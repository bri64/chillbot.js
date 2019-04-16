class CommandManager {
    constructor(musicManager) {
        this.musicManager = musicManager;
        this.commands = [];
    }

    async parseCommand(msg) {
        let message = msg.content;
        if (message[0] === "!") {
            let args = message.slice(1, message.length).split(" ");
            let commandName = args[0].toUpperCase();
            args = args.slice(1, args.length);
            let command;

            try {
                for (let cmd of Object.keys(Commands)) {
                    if (Commands[cmd].aliases && Commands[cmd].aliases().includes(commandName)) {
                        command = new Commands[cmd]();
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
            } catch (e) {
                console.error(e);
                command = new Commands.ErrorCommand();
                args = [ "An unknown error occurred!" ];
            } finally {
                await command.execute({
                    msg,
                    musicManager: this.musicManager,
                    args
                });
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