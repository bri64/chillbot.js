const { Util } = require("discord.js");
const YouTube = require('simple-youtube-api');
const { Playlist } = require('simple-youtube-api');
const ytdl = require("ytdl-core");
const fetch = require('node-fetch');

const streamOptions = {
    quality: "highestaudio",
    filter: "audioonly",
    liveBuffer: 5000
};

module.exports = class TrackLoader {
    constructor(tokens) {
        this.youtube = new YouTube(tokens.youtube);
        this.soundcloud_token = tokens.soundcloud;
    }

    async getStream(url) {
        return await ytdl(url, streamOptions);
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
            let playlist = new Playlist(this.youtube);
	    playlist.id = Playlist.extractID(url);
            let videos = await playlist.getVideos(999, {
		part: "snippet",
		fields: "items(id,kind,snippet(title,resourceId))"
	    });
            console.info(`Loaded ${videos.length} videos.`);
            return videos.map(video => TrackLoader.parseSong(video));
        } catch (e) {
            console.error(e);
        }
    }

    async loadTrack(url) {
        try {
            let video = await this.youtube.getVideo(url, {
		part: "snippet",
		fields: "items(id,kind,snippet(title))"
            });
            console.info(`Loaded 1 video.`);
            return [TrackLoader.parseSong(video)];
        } catch (e) {
            console.error(e);
        }
    }

    async loadSoundcloudTrack(url) {
        let result = await fetch(`http://api.soundcloud.com/resolve.json?url=${url}&client_id=${this.soundcloud_token}`);
        try {
            let info = await result.json();
            return [{
                type: "SOUNDCLOUD",
                data: {
                    stream: `http://api.soundcloud.com/tracks/${info.id}/stream?client_id=${this.soundcloud_token}`,
                    id: info.id,
                    title: Util.escapeMarkdown(info.title),
                    author: info.user.username,
                    url
                }
            }];
        } catch (e) {
            throw new Error(e);
        }
    }

    static parseSong(video) {
        return {
            type: "YOUTUBE",
            data: {
                id: video.id,
                title: Util.escapeMarkdown(video.title),
                url: `https://www.youtube.com/watch?v=${video.id}`,
                video: video
            }
        };
    }

    static parsePlaylist(playlist) {
        return {
            id: playlist.id,
            title: Util.escapeMarkdown(playlist.title),
            url: `https://www.youtube.com/playlist?list=${playlist.id}`
        };
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
};
