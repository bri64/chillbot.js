const {RichEmbed} = require("discord.js");

const Command = require("./command");

exports.CurrentCommand = class CurrentCommand extends Command {
    async execute(params) {
        await super.execute(params);
        try {
            let result = this.musicManager.getCurrentSong(this.guild);
            this.msg.reply(new RichEmbed({
                title: `Current Song:`,
                fields: [{
                    name: result.title,
                    value: result.url,
                    inline: true
                }],
                color: 0x00AAFF
            }));
        } catch (e) {
            this.msg.reply("No songs in queue.");
        }
    }

    static aliases() {
        return ["SONG", "NOWPLAYING", "CURRENT"];
    }
};