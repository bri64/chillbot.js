const Command = require("./command");

class PauseCommand extends Command {
    execute() {
        this.musicManager.togglePause();
    }
}

module.exports = PauseCommand;