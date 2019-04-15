const { RichEmbed } = require("discord.js");

const Command = require("./command");

class SearchCommand extends Command {
    async execute() {
        try {
            let results = await this.musicManager.search(this.query);
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
        } catch(e) {
            this.msg.reply(`No results found for '${this.query}'.`);
            console.error(e);
        }
    }
}

module.exports = SearchCommand;