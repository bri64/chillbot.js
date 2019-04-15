const ytdl = require("ytdl-core");
const Utils = require("./utils");

class MusicManager {
    constructor(client, tokens) {
        this.client = client;

        this.trackLoader = new (require("./track-loader"))(tokens);
        this.queue = [];
        this.currentSong = 0;
        this.currentVoiceChannel = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.isShuffle = true;
        this.loopMode = LoopMode.ALL;
        this.dispatcher = null;
    }


    async play(song, voiceChannel) {
        try {
            console.log("Playing: " + song.title);

            this.currentVoiceChannel = voiceChannel;
            let connection = await voiceChannel.join();

            this.isPlaying = true;
            this.isPaused = false;
            this.currentSong = this.queue.indexOf(song);

            let streamOptions = {
                quality: "highestaudio",
                filter: "audioonly",
                liveBuffer: 50
            };

            this.dispatcher = connection.playStream(ytdl(song.url, streamOptions))
                .on("end", async (reason) => {
                    if (reason != null) {
                        await this.nextTrack();
                    }
                }).on("error", (e) => console.error(e));
            await this.client.user.setActivity(`🎵 ${song.title}`, { type: 'LISTENING' });
            await this.client.user.setStatus('online');
        } catch (e) {
            console.error(e);
        }
    }

    togglePause() {
        if (this.dispatcher) {
            if (this.isPaused) {
                this.isPaused = false;
                this.dispatcher.pause();
            } else {
                this.isPaused = true;
                this.dispatcher.resume();
            }
        } else {
            throw new Error();
        }
    }

    async stop() {
        try {
            this.isPlaying = false;
            this.isPaused = false;
            this.queue = [];
            this.currentSong = 0;
            if (this.currentVoiceChannel) {
                this.currentVoiceChannel.leave();
                this.currentVoiceChannel = null;
            }
            await this.client.user.setStatus('idle');
            await this.client.user.setActivity('🎵 No Songs Playing', { type: "LISTENING" });
        } catch(e) {
            console.error(e);
        }
    }

    async nextTrack() {
        if (this.activeQueue()) {
            switch (this.loopMode) {
                case LoopMode.NONE:
                    if (this.currentSong !== this.queue.length - 1) {
                        await this.play(this.queue[((this.currentSong + 1) % this.queue.length)], this.currentVoiceChannel);
                    } else {
                        await this.stop();
                    }
                    break;
                case LoopMode.ALL:
                    await this.play(this.queue[((this.currentSong + 1) % this.queue.length)], this.currentVoiceChannel);
                    break;
                case LoopMode.ONE:
                default:
                    await this.play(this.queue[(this.currentSong)], this.currentVoiceChannel);
                    break;
            }
        } else {
            throw new Error();
        }
    }

    async prevTrack() {
        if (this.activeQueue()) {
            switch (this.loopMode) {
                case LoopMode.NONE:
                    if (this.currentSong !== 0) {
                        await this.play(this.queue[((this.currentSong - 1) % this.queue.length)], this.currentVoiceChannel);
                    } else {
                        await this.play(this.queue[(this.currentSong)], this.currentVoiceChannel);
                    }
                    break;
                case LoopMode.ALL:
                    await this.play(this.queue[((this.currentSong - 1) % this.queue.length)], this.currentVoiceChannel);
                    break;
                case LoopMode.ONE:
                default:
                    await this.play(this.queue[(this.currentSong)], this.currentVoiceChannel);
                    break;
            }
        } else {
            throw new Error();
        }
    }
    
    async seek(query) {
        if (this.activeQueue()) {
            let results = this.queue.filter(song => song.title.toUpperCase().includes(query.toUpperCase()));
            if (results.length > 0) {
                await this.play(results[0], this.currentVoiceChannel);
            } else {
                throw new Error();
            }
        } else {
            throw new Error();
        }
    }

    async shuffle() {
        if (this.activeQueue()) {
            this.queue = Utils.shuffleArray(this.queue);
            await this.play(this.queue[0], this.currentVoiceChannel);
        } else {
            throw new Error();
        }
    }

    async search(query) {
        return await this.trackLoader.search(query);
    }

    getCurrentSong() {
        if (this.activeQueue()) {
            return this.queue[this.currentSong];
        } else {
            throw new Error();
        }
    }

    playlist() {
        if (this.activeQueue()) {
            let start = this.currentSong + 1;
            let end = start + 5;
            return this.queue.slice(start, (this.queue.length >= end) ? end : this.queue.length);
        } else {
            throw new Error();
        }
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
    }

    toggleLoop() {
        switch (this.loopMode) {
            case LoopMode.NONE:
                this.loopMode = LoopMode.ALL;
                break;
            case LoopMode.ALL:
                this.loopMode = LoopMode.ONE;
                break;
            case LoopMode.ONE:
            default:
                this.loopMode = LoopMode.NONE;
                break;
        }
    }

    async addToQueue(url, member, instant) {
        let songs = await this.trackLoader.loadURL(url);
        songs = songs.filter(song => {
            return song.title !== "Deleted video"
                && (!song.video.raw.status || song.video.raw.status.privacyStatus !== "private");
        });
        if (this.isShuffle) {
            songs = Utils.shuffleArray(songs);
        }

        this.queue = [ ... this.queue, ... songs ];

        if (instant || !this.isPlaying) {
            await this.play(songs[0], member.voiceChannel);
        }
    }
    
    activeQueue() {
        return (this.currentVoiceChannel && this.queue.length > 0);
    }
}

const LoopMode = {
    NONE: "NONE",
    ALL: "ALL",
    ONE: "ONE"
};

module.exports = MusicManager;