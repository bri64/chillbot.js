const Command = require("./command");

exports.PauseCommand = class PauseCommand extends Command {
    async execute(params) {
        await super.execute(params);
        try {
            this.musicManager.togglePause();
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }

    static aliases() {
        return ["PAUSE", "RESUME", "UNPAUSE"];
    }
};