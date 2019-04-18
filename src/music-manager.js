const ytdl = require("ytdl-core");
const Utils = require("./utils");
const LoopMode = require("./enums/loop-mode");
const Shard = require("./shard");

class MusicManager {
    constructor(client, tokens) {
        this.client = client;
        this.trackLoader = new (require("./track-loader"))(tokens);
        this.shards = {};
    }

    /* Shards */
    getShard(guild) {
        if (!this.shards[guild.id]) {
            this.shards[guild.id] = new Shard(guild);
        }
        return this.shards[guild.id];
    }

    getActiveShards() {
        return (Object.keys(this.shards).filter(shard => this.shards[shard].hasSongs())).length;
    }

    async shutdown() {
        await Object.keys(this.shards).forEach(async (shard) => await this.stop(this.shards[shard].guild));
    }

    /* Music */
    async addToQueue(guild, url, channel, instant) {
        try {
            let shard = this.getShard(guild);

            let songs = await this.trackLoader.loadURL(url);
            songs = songs.filter(song => {
                return song.title !== "Deleted video"
                    || ((song.video)
                    && (song.video.raw)
                    && (song.video.raw.status)
                    && (song.video.raw.status.privacyStatus !== "private"));
            });
            if (shard.isShuffle) {
                songs = Utils.shuffleArray(songs);
            }

            shard.queue = [...shard.queue, ...songs];

            if (instant || !shard.isPlaying) {
                await this.play(guild, songs[0], channel);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async play(guild, song, voiceChannel) {
        let shard = this.getShard(guild);

        try {
            console.log(`[${guild.name}] Playing: ${song.title}`);

            let connection;
            if (voiceChannel) {
                connection = await voiceChannel.join();
            } else {
                connection = await (await guild.fetchMember(this.client.user)).voiceChannel.join();
            }

            shard.isPlaying = true;
            shard.isPaused = false;
            shard.currentSong = shard.queue.indexOf(song);

            let streamOptions = {
                quality: "highestaudio",
                filter: "audioonly",
                liveBuffer: 5000
            };

            if (song.type === "YOUTUBE") {
                shard.dispatcher = connection.playStream(ytdl(song.data.url, streamOptions))
                    .on("end", async (reason) => {
                        if (reason != null) {
                            await this.nextTrack(guild);
                        }
                    })
                    .on("error", (e) => console.error(e));
                shard.dispatcher.setVolumeLogarithmic(shard.volume);
            } else if (song.type === "SOUNDCLOUD") {
                let stream = song.data.stream;
                shard.dispatcher = connection.playArbitraryInput(stream, {})
                    .on("start", () => {

                    })
                    .on("end", async (reason) => {
                        if (reason != null) {
                            await this.stop(guild);
                        }
                    })
                    .on("error", (e) => console.error(e));
                shard.dispatcher.setVolumeLogarithmic(shard.volume);
            } else {
                throw new Error("Unknown track format!");
            }

            await this.client.user.setActivity(`🎵 on ${this.getActiveShards()} servers!`, { type: 'LISTENING' });
        } catch (e) {
            console.error(e);
        }
    }

    async stop(guild) {
        let shard = this.getShard(guild);

        try {
            shard.isPlaying = false;
            shard.isPaused = false;
            shard.queue = [];
            shard.currentSong = 0;
            let voiceChannel = (await guild.fetchMember(this.client.user)).voiceChannel;
            if (voiceChannel) {
                voiceChannel.leave();
            }
            await this.client.user.setActivity(`🎵 on ${this.getActiveShards()} servers!`, { type: 'LISTENING' });
        } catch(e) {
            console.error(e);
        }
    }

    async nextTrack(guild) {
        let shard = this.getShard(guild);

        if (shard.hasSongs()) {
            switch (shard.loopMode) {
                case LoopMode.NONE:
                    if (shard.currentSong !== shard.queue.length - 1) {
                        await this.play(guild, shard.queue[((shard.currentSong + 1) % shard.queue.length)], null);
                    } else {
                        await this.stop(guild);
                    }
                    break;
                case LoopMode.ALL:
                    await this.play(guild, shard.queue[((shard.currentSong + 1) % shard.queue.length)], null);
                    break;
                case LoopMode.ONE:
                default:
                    await this.play(guild, shard.queue[(shard.currentSong)], null);
                    break;
            }
        } else {
            throw new Error();
        }
    }

    async prevTrack(guild) {
        let shard = this.getShard(guild);

        if (shard.hasSongs()) {
            let song = shard.currentSong + shard.queue.length;
            switch (shard.loopMode) {
                case LoopMode.NONE:
                    if (shard.currentSong !== 0) {
                        await this.play(guild, shard.queue[((song - 1) % shard.queue.length)], null);
                    } else {
                        await this.play(guild, shard.queue[((song) % shard.queue.length)], null);
                    }
                    break;
                case LoopMode.ALL:
                    await this.play(guild, shard.queue[((song - 1) % shard.queue.length)], null);
                    break;
                case LoopMode.ONE:
                default:
                    await this.play(guild, shard.queue[((song) % shard.queue.length)], null);
                    break;
            }
        } else {
            throw new Error();
        }
    }
    
    async seek(guild, query) {
        let shard = this.getShard(guild);

        if (shard.hasSongs()) {
            let results = shard.queue.filter(song => song.title.toUpperCase().includes(query.toUpperCase()));
            if (results.length > 0) {
                await this.play(guild, results[0], null);
            } else {
                throw new Error();
            }
        } else {
            throw new Error();
        }
    }

    async shuffle(guild) {
        let shard = this.getShard(guild);

        if (shard.hasSongs()) {
            shard.queue = Utils.shuffleArray(shard.queue);
            await this.play(guild, shard.queue[0], null);
        } else {
            throw new Error();
        }
    }

    async search(guild, query) {
        return await this.trackLoader.search(query);
    }

    async searchPlaylist(guild, query) {
        return await this.trackLoader.searchPlaylist(query);
    }

    togglePause(guild) {
        let shard = this.getShard(guild);

        if (shard.dispatcher) {
            if (shard.isPaused) {
                shard.isPaused = false;
                shard.dispatcher.pause();
            } else {
                shard.isPaused = true;
                shard.dispatcher.resume();
            }
        } else {
            throw new Error();
        }
    }

    setVolume(guild, volume) {
        let shard = this.getShard(guild);

        shard.volume = volume;
        if (shard.dispatcher) {
            shard.dispatcher.setVolumeLogarithmic(volume);
        }
    }

    toggleShuffle(guild, toggle) {
        let shard = this.getShard(guild);

        shard.isShuffle = toggle;
    }

    toggleLoop(guild) {
        let shard = this.getShard(guild);

        switch (shard.loopMode) {
            case LoopMode.NONE:
                shard.loopMode = LoopMode.ALL;
                break;
            case LoopMode.ALL:
                shard.loopMode = LoopMode.ONE;
                break;
            case LoopMode.ONE:
            default:
                shard.loopMode = LoopMode.NONE;
                break;
        }
        return shard.loopMode;
    }

    setLoop(guild, loop) {
        let shard = this.getShard(guild);

        shard.loopMode = loop;
    }

    /* Status */
    getCurrentSong(guild) {
        let shard = this.getShard(guild);

        if (shard.hasSongs()) {
            return shard.queue[shard.currentSong];
        } else {
            throw new Error();
        }
    }

    playlist(guild) {
        let shard = this.getShard(guild);

        if (shard.hasSongs()) {
            let start = shard.currentSong + 1;
            let end = start + 5;
            return shard.queue.slice(start, (shard.queue.length >= end) ? end : shard.queue.length);
        } else {
            throw new Error();
        }
    }
}

module.exports = MusicManager;