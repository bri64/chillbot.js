const Command = require("./command");

class SeekCommand extends Command {
    async execute() {
        try {
            await this.musicManager.seek(this.query);
        } catch {
            this.msg.reply(`No results found for '${this.query}'.`);
        }
    }
}

module.exports = SeekCommand;