const Command = require("./command");

class PlayCommand extends Command {
    execute() {
        this.musicManager.addToQueue(this.url, this.msg.member, this.instant)
            .catch(() => {
                this.msg.reply(`Failed to load ${this.url}!`);
            });
    }
}

module.exports = PlayCommand;