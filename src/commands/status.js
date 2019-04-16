const {RichEmbed} = require("discord.js");

const Command = require("./command");

exports.StatusCommand = class StatusCommand extends Command {
    async execute(params) {
        await super.execute(params);
        try {
            let results = await this.musicManager.playlist();
            let fields = [];
            for (let result of results) {
                fields.push({
                    name: result.title,
                    value: result.url,
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
        return ["STATUS", "PLAYLIST"];
    }
};