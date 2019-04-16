const Command = require("./command");

exports.KillCommand = class KillCommand extends Command {
    async execute(params) {
        await super.execute(params);
        let guild = this.msg.guild;
        await this.musicManager.stop(guild);
    }

    static aliases() {
        return ["KILL", "STOP"];
    }
};