const ytdl = require("ytdl-core");
const Utils = require("./utils");

class MusicManager {
    constructor(client, tokens) {
        this.client = client;
        this.tokens = tokens;

        this.trackLoader = new (require("./track-loader"))(tokens);
        this.queue = [];
        this.currentSong = 0;
        this.currentVoiceChannel = null;
        this.isPlaying = false;
        this.isShuffle = true;
        this.loopMode = LoopMode.ALL;
        this.dispatcher = null;
    }


    async play(song, voiceChannel) {
        try {

            console.log("Playing: " + song.title);
            console.log(song.video);

            this.currentVoiceChannel = voiceChannel;
            let connection = await voiceChannel.join();

            this.isPlaying = true;
            this.currentSong = this.queue.indexOf(song);

            let streamOptions = {
                quality: "highestaudio",
                filter: "audioonly",
                liveBuffer: 50
            };

            this.dispatcher = connection.playStream(ytdl(song.url, streamOptions))
                .on("end", async (reason) => {
                    console.log("Reason: " + reason);
                    if (reason != null) {
                        await this.nextTrack();
                    }
                }).on("error", (e) => console.error(e));
        } catch (e) {
            console.error(e);
        }
    }

    togglePause() {
        if (this.dispatcher) {
            if (this.isPlaying) {
                this.isPlaying = false;
                this.dispatcher.pause();
                console.info('Audio Paused.');
            } else {
                this.isPlaying = true;
                this.dispatcher.resume();
                console.info('Audio Resumed')
            }
        }
    }

    stop() {
        this.isPlaying = false;
        this.queue = [];
        this.currentSong = 0;
        this.currentVoiceChannel.leave();
        this.currentVoiceChannel = null;

    }

    async nextTrack() {
        let voiceChannel = this.currentVoiceChannel;
        switch (this.loopMode) {
            case LoopMode.NONE:
                if (this.currentSong !== this.queue.length - 1) {
                    await this.play(this.queue[((this.currentSong + 1) % this.queue.length)], voiceChannel);
                } else {
                    this.stop();
                }
                break;
            case LoopMode.ALL:
                await this.play(this.queue[((this.currentSong + 1) % this.queue.length)], voiceChannel);
                break;
            case LoopMode.ONE:
            default:
                await this.play(this.queue[(this.currentSong)], voiceChannel);
                break;
        }
    }

    async prevTrack() {
        let voiceChannel = this.currentVoiceChannel;
        switch (this.loopMode) {
            case LoopMode.NONE:
                if (this.currentSong !== 0) {
                    await this.play(this.queue[((this.currentSong - 1) % this.queue.length)], voiceChannel);
                } else {
                    await this.play(this.queue[(this.currentSong)], voiceChannel);
                }
                break;
            case LoopMode.ALL:
                await this.play(this.queue[((this.currentSong - 1) % this.queue.length)], voiceChannel);
                break;
            case LoopMode.ONE:
            default:
                await this.play(this.queue[(this.currentSong)], voiceChannel);
                break;
        }
    }
    
    async seek(query) {
        let results = this.queue.filter(song => song.title.toUpperCase().includes(query.toUpperCase()));
        if (results.length > 0) {
            await this.play(results[0], this.currentVoiceChannel);
        } else {
            throw new Error();
        }
    }

    shuffle() {
        this.queue = Utils.shuffleArray(this.queue);
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

        if (instant) {
            await this.play(songs[0], member.voiceChannel);
        }
    }
}

const LoopMode = {
    NONE: "NONE",
    ALL: "ALL",
    ONE: "ONE"
};

module.exports = MusicManager;