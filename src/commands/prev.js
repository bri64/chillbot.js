const Command = require("./command");

exports.PrevTrackCommand = class PrevTrackCommand extends Command {
    async execute(params) {
        await super.execute(params);
        try {
            await this.musicManager.prevTrack();
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }

    static aliases() {
        return ["BACK", "PREV"];
    }
};