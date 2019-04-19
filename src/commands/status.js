const {RichEmbed} = require("discord.js");

const Command = require("./command");

exports.StatusCommand = class StatusCommand extends Command {
    async execute(params) {
        await super.execute(params);
        try {
            let results = await this.shardManager.getPlaylist(this.guild);
            let fields = [];
            for (let result of results) {
                fields.push({
                    name: result.data.title,
                    value: result.data.url,
                    inline: true
                });
            }
            this.msg.reply(new RichEmbed({
                title: `Upcoming Songs (${results.length}):`,
                fields: fields,
                color: 0x00AAFF
            }));
        } catch {
            this.msg.reply("No songs in queue.");
        }
    }

    static aliases() {
        return ["UPNEXT", "STATUS", "PLAYLIST"];
    }

    static help() {
        return {
            name: "Up Next",
            description: "Shows the next five songs in the queue.",
            usage: "!upnext",
        };
    }
};