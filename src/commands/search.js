const {RichEmbed} = require("discord.js");
const Utils = require("../utils");

const Command = require("./command");

exports.SearchCommand = class SearchCommand extends Command {
    async execute(params) {
        await super.execute(params);
        this.page = 1;

        if (this.args.length <= 0) {
            this.msg.reply(`Invalid arguments. !${this.command.toLowerCase()} [ playlist ] { url }`);
            return;
        }

        let isPlaylist = this.args[0].toUpperCase() === "PLAYLIST";
        let query = (isPlaylist)
            ? this.args.slice(1, this.args.length).join(" ")
            : this.args.join(" ");

        try {
            let initResults = await this.getResults(isPlaylist, query, this.page);
            let reply = await this.msg.reply(initResults.embed);
            await this.handlePageReactions(reply, isPlaylist, query, initResults);
        } catch (e) {
            this.msg.reply(`No results found for '${query}'.`);
        }
    }

    async handlePageReactions(reply, isPlaylist, query, initResults) {
        const prevEmoji = '⏮';
        const nextEmoji = '⏭';
        await reply.react(prevEmoji);
        await reply.react(nextEmoji);
        const prevFilter = (reaction) => reaction.emoji.name === prevEmoji;
        const nextFilter = (reaction) => reaction.emoji.name === nextEmoji;
        const prevCollector = reply.createReactionCollector(prevFilter, { time: 120000 });
        const nextCollector = reply.createReactionCollector(nextFilter, { time: 120000 });
        prevCollector.on('collect', () => this.handlePrevPage(reply, isPlaylist, query, initResults));
        nextCollector.on('collect', () => this.handleNextPage(reply, isPlaylist, query, initResults));
        prevCollector.on('end', () => Utils.clearReactions(reply, true));
        nextCollector.on('end', () => Utils.clearReactions(reply, true));
    }

    async getResults(isPlaylist, query, page, prevResults) {
        const MAX_RESULTS = 50;
        const PAGE_SIZE = 5;
        const MIN_PAGE = 1;
        const MAX_PAGE = (MAX_RESULTS / PAGE_SIZE);
        console.log(page);
        page = (page <= MIN_PAGE) ? MIN_PAGE : ((page > MAX_PAGE) ? MAX_PAGE : page);
        console.log(page);
        let results = (prevResults != null)
            ? prevResults
            : ((isPlaylist)
                ? await this.shardManager.searchPlaylist(query, MAX_RESULTS)
                : await this.shardManager.search(query, MAX_RESULTS));
        let pagedResults = results.slice((page * PAGE_SIZE) - PAGE_SIZE, page * PAGE_SIZE);
        let fields = [];
        pagedResults.forEach(result => {
            fields.push({
                name: result.data.title,
                value: result.data.url,
                inline: true
            });
        });
        return {
            results,
            embed: new RichEmbed({
                title: `Search Results [${page}/10]`,
                fields: fields,
                color: 0xFF0000
            })
        }
    }

    async handlePrevPage(reply, isPlaylist, query, initResults) {
        await reply.edit(await this.getResults(isPlaylist, query, this.page -= 1, initResults.results).embeds);
        Utils.clearReactions(reply,false);
    }

    async handleNextPage(reply, isPlaylist, query, initResults) {
        await reply.edit(await this.getResults(isPlaylist, query, this.page += 1, initResults.results));
        Utils.clearReactions(reply, false);
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