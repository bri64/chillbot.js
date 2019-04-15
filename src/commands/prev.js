const Command = require("./command");

exports.PrevTrackCommand = class PrevTrackCommand extends Command {
    async execute() {
        try {
            await this.musicManager.prevTrack();
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }
};