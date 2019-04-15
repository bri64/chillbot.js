const Command = require("./command");

class ShuffleCommand extends Command {
    async execute() {
        try {
            await this.musicManager.shuffle();
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }
}

module.exports = ShuffleCommand;