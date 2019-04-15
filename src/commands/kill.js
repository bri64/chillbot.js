const Command = require("./command");

class KillCommand extends Command {
    constructor(params) {
        super(params);
        Object.assign(this, params);
    }

    execute() {
        this.musicManager.stop();
    }
}

module.exports = KillCommand;