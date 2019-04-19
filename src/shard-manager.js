const Shard = require("./shard");

module.exports = class ShardManager {
    constructor(client, tokens) {
        this.client = client;
        this.trackLoader = new (require("./track-loader"))(tokens);
        this.shards = {};

        this.timer = setInterval(async () => {
            await this.client.user.setActivity(`🎵 on ${this.getActiveShards()} servers!`, { type: 'LISTENING' })
        }, 5000);
    }

    /* Shards */
    getShard(guild) {
        if (!this.shards[guild.id]) {
            this.shards[guild.id] = new Shard(guild, this.client, this.trackLoader);
        }
        return this.shards[guild.id];
    }

    getActiveShards() {
        return (Object.keys(this.shards).filter(shard => this.shards[shard].hasSongs())).length;
    }

    async shutdown() {
        clearInterval(this.timer);
        await Object.keys(this.shards).forEach(async (shard) => await this.stop(this.shards[shard].guild));
    }

    /* Music */
    async addToQueue(guild, url, voiceChannel, instant) {
        await this.getShard(guild).addToQueue(url, voiceChannel, instant);
    }

    async stop(guild) {
        await this.getShard(guild).stop();
    }

    async nextTrack(guild) {
        await this.getShard(guild).nextTrack();
    }

    async prevTrack(guild) {
        await this.getShard(guild).prevTrack();
    }

    async pause(guild) {
        setTimeout(async () => {
            await this.getShard(guild).pause()
        });
    }
    
    async seek(guild, query) {
        await this.getShard(guild).seek(query);
    }

    async shuffle(guild) {
        await this.getShard(guild).shuffle();
    }

    async toggleShuffle(guild, toggle) {
        await this.getShard(guild).toggleShuffle(toggle);
    }

    async toggleLoop(guild) {
        await this.getShard(guild).toggleLoop();
    }

    async setLoop(guild, loop) {
        await this.getShard(guild).setLoop(loop);
    }

    async setVolume(guild, volume) {
        await this.getShard(guild).setVolume(volume);
    }

    /* Searching */
    async search(query) {
        return await this.trackLoader.search(query);
    }

    async searchPlaylist(query) {
        return await this.trackLoader.searchPlaylist(query);
    }

    /* Status */
    async currentSong(guild) {
        await this.getShard(guild).currentSong();
    }

    async playlist(guild) {
        await this.getShard(guild).playlist();
    }
};