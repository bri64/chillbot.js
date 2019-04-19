const Command = require("./command");

exports.SeekCommand = class SeekCommand extends Command {
    async execute(params) {
        await super.execute(params);
        let query = this.args.join(" ");
        try {
            await this.shardManager.seek(this.guild, query);
        } catch {
            this.msg.reply(`No results found for '${query}'.`);
        }
    }

    static aliases() {
        return ["SEEK", "FIND", "GOTO"];
    }

    static help() {
        return {
            name: "Seek",
            description: "Skips to the specified song in the queue if it exists.",
            usage: "!seek QUERY",
        };
    }
};