const Command = require("./command");

exports.PauseCommand = class PauseCommand extends Command {
    async execute(params) {
        await super.execute(params);
        try {
            await this.shardManager.pause(this.guild);
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }

    static aliases() {
        return ["PAUSE", "RESUME", "UNPAUSE"];
    }

    static help() {
        return {
            name: "Pause",
            description: "Pauses or resumes playback.",
            usage: "!pause",
        };
    }
};