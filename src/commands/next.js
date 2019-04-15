const Command = require("./command");

exports.NextTrackCommand = class NextTrackCommand extends Command {
    async execute() {
        try {
            await this.musicManager.nextTrack();
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }
};