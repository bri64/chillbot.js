const { Util } = require("discord.js");
const YouTube = require('simple-youtube-api');
const fetch = require('node-fetch');
class TrackLoader {
    constructor(tokens) {
        this.youtube = new YouTube(tokens.youtube);
    }

    async loadURL(url) {
        let songURL = url.toLowerCase();
        if (songURL.includes("youtube") || songURL.includes("youtu.be")) {
            return this.loadYouTubeURL(url);
        } else if (songURL.includes("soundcloud")) {
            return this.loadSoundcloudTrack(url);
        } else {
            throw new Error("Unknown URL format!");
        }
    }

    async loadYouTubeURL(url) {
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
            return videos.map(video => TrackLoader.videoToSong(video));
        } catch (e) {
            console.error(e);
        }
    }

    async loadTrack(url) {
        try {
            let video = await this.youtube.getVideo(url);
            return [TrackLoader.videoToSong(video)];
        } catch (e) {
            console.error(e);
        }
    }

    async loadSoundcloudTrack(url) {
        console.log("soundlaod");
        let infoRequest = `http://api.soundcloud.com/resolve.json?url=${url}&client_id=71dfa98f05fa01cb3ded3265b9672aaf`;
        let result = await fetch(infoRequest);
        try {
            let info = await result.json();
            let trackRequest = `http://api.soundcloud.com/tracks/${info.id}/stream?consumer_key=71dfa98f05fa01cb3ded3265b9672aaf`;
            let stream = await fetch(trackRequest);
            return [{
                type: "SOUNDCLOUD",
                data: {
                    stream: stream.body,
                    id: info.id,
                    title: Util.escapeMarkdown(info.title),
                    author: info.user.username,
                    url: info.permalink_url
                }
            }];
        } catch (e) {
            throw new Error(e);
        }
    }

    async search(query) {
        try {
            return (await this.youtube.searchVideos(query)).map(video => TrackLoader.videoToSong(video));
        } catch (e) {
            console.error(e);
        }
    }

    static videoToSong(video) {
        return {
            type: "YOUTUBE",
            data: {
                id: video.id,
                title: Util.escapeMarkdown(video.title),
                author: video.channel.title,
                url: `https://www.youtube.com/watch?v=${video.id}`,
                video: video
            }
        };
    }

}

module.exports = TrackLoader;