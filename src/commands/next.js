const Command = require("./command");

exports.NextTrackCommand = class NextTrackCommand extends Command {
    async execute(params) {
        await super.execute(params);
        try {
            await this.musicManager.nextTrack();
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }

    static aliases() {
        return ["NEXT", "SKIP"];
    }
};