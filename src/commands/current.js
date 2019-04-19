const {RichEmbed} = require("discord.js");

const Command = require("./command");

exports.CurrentCommand = class CurrentCommand extends Command {
    async execute(params) {
        await super.execute(params);
        try {
            let result = (await this.shardManager.getCurrentSong(this.guild)).data;
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
        return ["CURRENT", "SONG", "NOWPLAYING"];
    }

    static help() {
        return {
            name: "Current Song",
            description: "Displays the current playing song.",
            usage: "!current",
        };
    }
};