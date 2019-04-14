const { Util } = require("discord.js");
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

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
        let playlist = await this.youtube.getPlaylist(url);
        let videos = await playlist.getVideos();
        return videos.map(video => TrackLoader.videoToSong(video));
    }

    async loadTrack(url) {
        let video = await this.youtube.getVideo(url);
        return [TrackLoader.videoToSong(video)];
    }

    static videoToSong(video) {
        return {
            id: video.id,
            title: Util.escapeMarkdown(video.title),
            url: `https://www.youtube.com/watch?v=${video.id}`
        };
    }

}

module.exports = TrackLoader;