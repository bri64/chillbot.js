const Command = require("./command");

class ShuffleCommand extends Command {
    async execute() {
        try {
            await this.musicManager.shuffle();
        } catch {
            this.msg.reply('There are no songs to shuffle');
        }
    }
}

module.exports = ShuffleCommand;