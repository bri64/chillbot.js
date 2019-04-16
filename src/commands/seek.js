const Command = require("./command");

exports.SeekCommand = class SeekCommand extends Command {
    async execute(params) {
        await super.execute(params);
        let query = this.args.join(" ");
        try {
            await this.musicManager.seek(query);
        } catch {
            this.msg.reply(`No results found for '${query}'.`);
        }
    }

    static aliases() {
        return ["SEEK", "FIND", "GOTO"];
    }
};