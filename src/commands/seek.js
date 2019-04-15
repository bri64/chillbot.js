const Command = require("./command");

class SeekCommand extends Command {
    constructor(params) {
        super(params);
        Object.assign(this, params);
    }

    async execute() {
        try {
            await this.musicManager.seek(this.query);
        } catch {
            this.msg.reply(`No results found for '${this.query}'.`);
        }
    }
}

module.exports = SeekCommand;