const Command = require("./command");

exports.PlayCommand = class PlayCommand extends Command {
    async execute(params) {
        await super.execute(params);
        let url = this.args[0];
        let channel = this.msg.member.voiceChannel;
        if (channel) {
            this.musicManager.addToQueue(url, channel, true)
                .catch(() => {
                    this.msg.reply(`Failed to load ${url}!`);
                });
        } else {
            this.msg.reply("You must be in a voice channel!");
        }
    }

    static aliases() {
        return ["PLAY", "ADD", "QUEUE"];
    }
};