const Command = require("./command");

exports.KillCommand = class KillCommand extends Command {
    async execute() {
        await this.musicManager.stop();
    }
};