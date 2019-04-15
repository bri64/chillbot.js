const Command = require("./command");

exports.PingCommand = class PingCommand extends Command {
    execute() {
        this.msg.reply.send("Pong!")
    }
};