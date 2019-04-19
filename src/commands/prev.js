const Command = require("./command");

exports.PrevTrackCommand = class PrevTrackCommand extends Command {
    async execute(params) {
        await super.execute(params);
        try {
            await this.musicManager.prevTrack(this.guild);
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }

    static aliases() {
        return ["PREV", "BACK"];
    }

    static help() {
        return {
            name: "Previous Song",
            description: "Plays the previous song in the queue.",
            usage: "!prev",
        };
    }
};