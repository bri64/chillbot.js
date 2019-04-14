const ytdl = require("ytdl-core");

class MusicManager {
    constructor(client, tokens) {
        this.client = client;
        this.tokens = tokens;

        this.trackLoader = new (require("./track-loader"))(tokens);
        this.queue = [];
        this.state = {
            currentSong: 0,
            currentVoiceChannel: 0,
            isPlaying: false,
            isShuffle: true,
            loopMode: LoopMode.ALL
        };
    }


    async play(song, voiceChannel) {
        try {
            this.state.currentVoiceChannel = voiceChannel;
            let connection = await voiceChannel.join();

            this.state.isPlaying = true;
            this.state.currentSong = this.queue.indexOf(song);
            connection.playStream(ytdl(song.url))
                .on("end", () => this.nextTrack())
                .on("error", (e) => console.error(e));
        } catch (e) {
            console.error(e);
        }
    }

    pause() {

    }

    stop() {
        this.state.isPlaying = false;
        this.queue = [];
        this.state.currentSong = 0;
        this.state.currentVoiceChannel.leave();
        this.state.currentVoiceChannel = null;

    }

    async nextTrack() {
        let voiceChannel = this.state.currentVoiceChannel;
        switch (this.state.loopMode) {
            case LoopMode.NONE:
                if (this.state.currentSong !== this.queue.length - 1) {
                    await this.play(this.queue.get((this.state.currentSong + 1) % this.queue.length), voiceChannel);
                } else {
                    this.stop();
                }
                break;
            case LoopMode.ALL:
                await this.play(this.queue.get((this.state.currentSong + 1) % this.queue.length), voiceChannel);
                break;
            case LoopMode.ONE:
            default:
                await this.play(this.queue.get(this.state.currentSong), voiceChannel);
                break;
        }
    }

    async prevTrack() {
        let voiceChannel = this.state.currentVoiceChannel;
        switch (this.state.loopMode) {
            case LoopMode.NONE:
                if (this.state.currentSong !== 0) {
                    await this.play(this.queue.get((this.state.currentSong - 1) % this.queue.length), voiceChannel);
                } else {
                    await this.play(this.queue.get(this.state.currentSong), voiceChannel);
                }
                break;
            case LoopMode.ALL:
                await this.play(this.queue.get((this.state.currentSong - 1) % this.queue.length), voiceChannel);
                break;
            case LoopMode.ONE:
            default:
                await this.play(this.queue.get(this.state.currentSong), voiceChannel);
                break;
        }
    }

    shuffle() {
        this.queue = this.shuffleArray(this.queue);
    }

    toggleShuffle() {
        this.state.isShuffle = !this.state.isShuffle;
    }

    toggleLoop() {
        switch (this.state.loopMode) {
            case LoopMode.NONE:
                this.state.loopMode = LoopMode.ALL;
                break;
            case LoopMode.ALL:
                this.state.loopMode = LoopMode.ONE;
                break;
            case LoopMode.ONE:
            default:
                this.state.loopMode = LoopMode.NONE;
                break;
        }
    }

    async addToQueue(url, member, instant) {
        let songs = await this.trackLoader.loadURL(url);
        if (this.state.isShuffle) {
            songs = this.shuffleArray(songs);
        }

        this.queue = [ ...this.queue, songs ];

        if (instant) {
            console.log("playing...");
            await this.play(songs[0], member.voiceChannel);
        }
    }

    // Shuffle function
    shuffleArray(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}

const LoopMode = {
    NONE: "NONE",
    ALL: "ALL",
    ONE: "ONE"
};

module.exports = MusicManager;