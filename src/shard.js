const LoopMode = require("./enums/loop-mode");
const Utils = require("./utils");

module.exports = class Shard {
    constructor(guild, client, trackLoader) {
        this.guild = guild;
        this.client = client;
        this.trackLoader = trackLoader;

        this.queue = [];
        this.currentSong = 0;
        this.isShuffle = true;
        this.loopMode = LoopMode.ALL;
        this.volume = 0.3;
        this.dispatcher = null;
    }

    hasSongs() {
        return this.queue.length > 0;
    }

    /* Music */
    async addToQueue(url, channel, instant) {
        try {
            let songs = await this.trackLoader.loadURL(url);
            songs = songs.filter(song =>
                song.data.title.toUpperCase() !== "DELETED VIDEO"
                && song.data.title.toUpperCase() !== "PRIVATE VIDEO");
            if (this.isShuffle) {
                songs = Utils.shuffleArray(songs);
            }

            let alreadyPlaying = (this.queue.length > 0);
            this.queue = [...this.queue, ...songs];

            if (!alreadyPlaying || instant) {
                await this.play(songs[0], channel);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async play(song, voiceChannel) {
        try {
            console.log(`[${this.guild.name}] Playing: ${song.data.title}`);

            let connection;
            if (voiceChannel) {
                connection = await voiceChannel.join();
            } else {
                connection = await (await this.guild.fetchMember(this.client.user)).voiceChannel.join();
            }

            this.currentSong = this.queue.indexOf(song);

            if (song.type === "YOUTUBE") {
                this.dispatcher = connection.playStream(await this.trackLoader.getStream(song.data.url))
                    .on("end", async (reason) => {
                        if (reason != null) {
                            await this.nextTrack();
                        }
                    })
                    .on("error", (e) => console.error(e));
            } else if (song.type === "SOUNDCLOUD") {
                let stream = song.data.stream;
                this.dispatcher = connection.playArbitraryInput(stream, {})
                    .on("start", () => {

                    })
                    .on("end", async (reason) => {
                        if (reason != null) {
                            await this.nextTrack();
                        }
                    })
                    .on("error", (e) => console.error(e));
            } else {
                throw new Error("Unknown track format!");
            }
            this.dispatcher.setVolumeLogarithmic(this.volume);
        } catch (e) {
            console.error(e);
        }
    }

    async stop() {
        try {
            this.queue = [];
            this.currentSong = 0;
            let voiceChannel = (await this.guild.fetchMember(this.client.user)).voiceChannel;
            if (voiceChannel) {
                voiceChannel.leave();
            }
        } catch(e) {
            console.error(e);
        }
    }

    async nextTrack() {
        if (this.hasSongs()) {
            switch (this.loopMode) {
                case LoopMode.NONE:
                    if (this.currentSong !== this.queue.length - 1) {
                        await this.play(this.queue[((this.currentSong + 1) % this.queue.length)], null);
                    } else {
                        await this.stop();
                    }
                    break;
                case LoopMode.ALL:
                    await this.play(this.queue[((this.currentSong + 1) % this.queue.length)], null);
                    break;
                case LoopMode.ONE:
                default:
                    await this.play(this.queue[(this.currentSong)], null);
                    break;
            }
        } else {
            throw new Error();
        }
    }

    async prevTrack() {
        if (this.hasSongs()) {
            let song = this.currentSong + this.queue.length;
            switch (this.loopMode) {
                case LoopMode.NONE:
                    if (this.currentSong !== 0) {
                        await this.play(this.queue[((song - 1) % this.queue.length)], null);
                    } else {
                        await this.play(this.queue[((song) % this.queue.length)], null);
                    }
                    break;
                case LoopMode.ALL:
                    await this.play(this.queue[((song - 1) % this.queue.length)], null);
                    break;
                case LoopMode.ONE:
                default:
                    await this.play(this.queue[((song) % this.queue.length)], null);
                    break;
            }
        } else {
            throw new Error();
        }
    }

    async pause() {
        if (this.dispatcher) {
            if (!this.dispatcher.paused) {
                this.dispatcher.pause();
            } else {
                this.dispatcher.resume();
            }
        } else {
            throw new Error();
        }
    }

    async seek(query) {
        if (this.hasSongs()) {
            let results = this.queue.filter(song => song.title.toUpperCase().includes(query.toUpperCase()));
            if (results.length > 0) {
                await this.play(results[0], null);
            } else {
                throw new Error();
            }
        } else {
            throw new Error();
        }
    }

    async shuffle() {
        if (this.hasSongs()) {
            this.queue = Utils.shuffleArray(this.queue);
            await this.play(this.queue[0], null);
        } else {
            throw new Error();
        }
    }

    async toggleShuffle(toggle) {
        this.isShuffle = toggle;
    }

    async setLoop(loop) {
        this.loopMode = loop;
    }

    async toggleLoop() {
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
        return this.loopMode;
    }

    async setVolume(volume) {
        this.volume = volume;
        if (this.dispatcher) {
            this.dispatcher.setVolumeLogarithmic(volume);
        }
    }

    /* Status */
    async getCurrentSong() {
        if (this.hasSongs()) {
            return this.queue[this.currentSong];
        } else {
            throw new Error();
        }
    }

    async getPlaylist() {
        if (this.hasSongs()) {
            let start = this.currentSong + this.queue.length + 1;
            let amt = (this.queue.length > 5) ? 5 : this.queue.length - 1;
            let results = [];
            for (let i = 0; i < amt; i++) {
                results.push(this.queue[((start + i) % this.queue.length)])
            }
            return results;
        } else {
            throw new Error();
        }
    }
};