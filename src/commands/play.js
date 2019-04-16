const Command = require("./command");

exports.PlayCommand = class PlayCommand extends Command {
    async execute(params) {
        await super.execute(params);
        let url = this.args[0];
        this.musicManager.addToQueue(url, this.msg.member, true)
            .catch(() => {
                this.msg.reply(`Failed to load ${url}!`);
            });
    }

    static aliases() {
        return ["PLAY", "ADD", "QUEUE"];
    }
};