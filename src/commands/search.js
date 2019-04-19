const {RichEmbed} = require("discord.js");

const Command = require("./command");

exports.SearchCommand = class SearchCommand extends Command {
    async execute(params) {
        await super.execute(params);

        if (this.args.length <= 0) {
            this.msg.reply(`Invalid arguments. !${this.command.toLowerCase()} [ playlist ] { url }`);
            return;
        }

        let isPlaylist = this.args[0].toUpperCase() === "PLAYLIST";
        let query = (isPlaylist)
            ? this.args.slice(1, this.args.length).join(" ")
            : this.args.join(" ");

        try {
            let fields = [];
            let results = [];
            if (isPlaylist) {
                results = await this.musicManager.searchPlaylist(this.guild, query);
            } else {
                results = await this.musicManager.search(this.guild, query);
            }
            results.forEach(result => {
                fields.push({
                    name: result.title,
                    value: result.url,
                    inline: true
                });
            });
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

    static help() {
        return {
            name: "Search",
            description: "Searches YouTube for videos/playlists.",
            usage: "!search [playlist] QUERY",
        };
    }
};