const Command = require("./command");

exports.KillCommand = class KillCommand extends Command {
    async execute(params) {
        await super.execute(params);
        await this.shardManager.stop(this.guild);
    }

    static aliases() {
        return ["KILL", "STOP"];
    }

    static help() {
        return {
            name: "Kill",
            description: "Clears the queue and leaves the channel.",
            usage: "!kill",
        };
    }
};