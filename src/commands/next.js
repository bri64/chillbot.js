const Command = require("./command");

exports.NextTrackCommand = class NextTrackCommand extends Command {
    async execute(params) {
        await super.execute(params);
        try {
            await this.musicManager.nextTrack(this.guild);
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }

    static aliases() {
        return ["NEXT", "SKIP"];
    }

    static help() {
        return {
            name: "Next Song",
            description: "Plays the next song in the queue.",
            usage: "!next",
        };
    }
};