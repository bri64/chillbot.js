const LoopMode = require("./enums/loop-mode");

module.exports = class Shard {
    constructor(guild) {
        this.guild = guild;

        this.queue = [];
        this.currentSong = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.isShuffle = true;
        this.loopMode = LoopMode.ALL;
        this.volume = 0.3;
        this.dispatcher = null;
    }

    hasSongs() {
        return this.queue.length > 0;
    }
};