const Command = require("./command");

class PingCommand extends Command {
    constructor(params) {
        super(params);
        this.channel = params.channel;
    }

    execute() {
        this.channel.send("Pong!")
    }
}

module.exports = PingCommand;