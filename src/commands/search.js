const {RichEmbed} = require("discord.js");

const Command = require("./command");

exports.SearchCommand = class SearchCommand extends Command {
    async execute(params) {
        await super.execute(params);
        let query = this.args.join(" ");
        try {
            let results = await this.musicManager.search(query);
            let fields = [];
            for (let result of results) {
                fields.push({
                    name: result.title,
                    value: result.url,
                    inline: true
                });
            }
            this.msg.reply(new RichEmbed({
                title: 'Search Results',
                fields: fields,
                color: 0xFF0000
            }));
        } catch (e) {
            this.msg.reply(`No results found for '${query}'.`);
        }
    }

    static aliases() {
        return ["SEARCH", "YOUTUBE", "LOOKUP"];
    }
};