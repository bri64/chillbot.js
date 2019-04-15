const Command = require("./command");

class PauseCommand extends Command {
    execute() {
        try {
            this.musicManager.togglePause();
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }
}

module.exports = PauseCommand;