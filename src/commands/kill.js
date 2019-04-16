const Command = require("./command");

exports.KillCommand = class KillCommand extends Command {
    async execute(params) {
        await super.execute(params);
        await this.musicManager.stop(this.guild);
    }

    static aliases() {
        return ["KILL", "STOP"];
    }
};