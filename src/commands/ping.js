const Command = require("./command");

class PingCommand extends Command {
    execute() {
        this.msg.reply.send("Pong!")
    }
}

module.exports = PingCommand;