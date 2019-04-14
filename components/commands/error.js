const Command = require("./command");

class ErrorCommand extends Command {
    constructor(params) {
        super(params);
        this.channel = params.channel;
    }

    execute() {
        this.channel.send("Unknown command!")
    }
}

module.exports = ErrorCommand;