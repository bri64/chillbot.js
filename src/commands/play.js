const Command = require("./command");

exports.PlayCommand = class PlayCommand extends Command {
    execute() {
        this.musicManager.addToQueue(this.url, this.msg.member, this.instant)
            .catch(() => {
                this.msg.reply(`Failed to load ${this.url}!`);
            });
    }
};