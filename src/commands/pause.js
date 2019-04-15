const Command = require("./command");

exports.PauseCommand = class PauseCommand extends Command {
    execute() {
        try {
            this.musicManager.togglePause();
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }
};