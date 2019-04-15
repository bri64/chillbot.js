const Command = require("./command");

class NextTrackCommand extends Command {
    async execute() {
        try {
            await this.musicManager.nextTrack();
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }
}

module.exports = NextTrackCommand;