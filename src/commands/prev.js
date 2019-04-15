const Command = require("./command");

class PrevTrackCommand extends Command {
    async execute() {
        try {
            await this.musicManager.prevTrack();
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }
}

module.exports = PrevTrackCommand;