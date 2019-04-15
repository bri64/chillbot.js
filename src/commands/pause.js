const Command = require("./command");

class PauseCommand extends Command {
    constructor(params) {
        super(params);
        Object.assign(this, params);
    }

    execute() {
        this.musicManager.togglePause();
    }
}

module.exports = PauseCommand;