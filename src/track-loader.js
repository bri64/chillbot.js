const { Util } = require("discord.js");
const YouTube = require('simple-youtube-api');

class TrackLoader {
    constructor(tokens) {
        this.tokens = tokens;
        this.youtube = new YouTube(tokens.youtube);
    }

    async loadURL(url) {
        let isPlaylist = url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist.*$/);
        if (isPlaylist) {
            return await this.loadPlaylist(url);
        } else {
            return await this.loadTrack(url);
        }
    }

    async loadPlaylist(url) {
        try {
            let playlist = await this.youtube.getPlaylist(url);
            let videos = await playlist.getVideos();
            console.info(`Loaded ${videos.length} videos.`);
            return videos.map(video => TrackLoader.parseSong(video));
        } catch (e) {
            console.error(e);
        }
    }

    async loadTrack(url) {
        try {
            let video = await this.youtube.getVideo(url);
            return [TrackLoader.parseSong(video)];
        } catch (e) {
            console.error(e);
        }
    }

    async search(query) {
        try {
            return (await this.youtube.searchVideos(query))
                .map(video => TrackLoader.parseSong(video));
        } catch (e) {
            console.error(e);
        }
    }

    async searchPlaylist(query) {
        try {
            return (await this.youtube.searchPlaylists(query))
                .map(playlist => TrackLoader.parsePlaylist(playlist));
        } catch (e) {
            console.error(e);
        }
    }

    static parsePlaylist(playlist) {
        return {
            id: playlist.id,
            title: Util.escapeMarkdown(playlist.title),
            author: playlist.channel.title,
            url: `https://www.youtube.com/playlist?list=${playlist.id}`
        };
    }

    static parseSong(video) {
        return {
            id: video.id,
            title: Util.escapeMarkdown(video.title),
            author: video.channel.title,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            video: video
        };
    }

}

module.exports = TrackLoader;