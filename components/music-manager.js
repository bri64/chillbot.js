const LoopMode = {
    NONE, ALL, ONE
};

class MusicManager {
    constructor(client, tokens) {
        this.client = client;
        this.tokens = tokens;
        this.queue = [];
        this.state = {
            currentTrack: null,
            isPlaying: false,
            isShuffle: true,
            loopMode: LoopMode.ALL
        };
    }


    play() {

    }

    pause() {

    }

    nextTrack() {

    }

    prevTrack() {

    }

    shuffle() {

    }

    toggleShuffle() {

    }

    toggleLoop() {

    }

    addToQueue() {

    }

    removeFromQueue() {

    }
}

module.exports = MusicManager;