const { RichEmbed } = require("discord.js");

const Command = require("./command");

exports.CurrentCommand = class CurrentCommand extends Command {
    async execute() {
        try {
            let result = this.musicManager.getCurrentSong();
            this.msg.reply(new RichEmbed({
                title: `Current Song:`,
                fields: [{
                    name: result.title,
                    value: result.url,
                    inline: true
                }],
                color: 0x00AAFF
            }));
        } catch(e) {
            this.msg.reply("No songs in queue.");
        }
    }
};