const Command = require("./command");

exports.PingCommand = class PingCommand extends Command {
    async execute(params) {
        await super.execute(params);
        this.msg.reply.send("Pong!")
    }

    static aliases() {
        return ["PING"];
    }
};