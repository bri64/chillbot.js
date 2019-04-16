const Command = require("./command");

exports.ShuffleCommand = class ShuffleCommand extends Command {
    async execute(params) {
        await super.execute(params);
        try {
            await this.musicManager.shuffle(this.guild);
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }

    static aliases() {
        return ["SHUFFLE", "RANDOM"];
    }
};