const Command = require("./command");

class KillCommand extends Command {
    async execute() {
        await this.musicManager.stop();
    }
}

module.exports = KillCommand;