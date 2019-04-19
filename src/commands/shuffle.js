const Command = require("./command");

exports.ShuffleCommand = class ShuffleCommand extends Command {
    async execute(params) {
        await super.execute(params);
        try {
            await this.shardManager.shuffle(this.guild);
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }

    static aliases() {
        return ["SHUFFLE", "RANDOM"];
    }

    static help() {
        return {
            name: "Shuffle",
            description: "Shuffles the queue and plays the new first song.",
            usage: "!shuffle",
        };
    }
};