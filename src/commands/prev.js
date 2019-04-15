const Command = require("./command");

class PrevTrackCommand extends Command {
    constructor(params) {
        super(params);
        Object.assign(this, params);
    }

    execute() {
        this.musicManager.prevTrack().then(() => {

        })
        .catch((e) => {
            console.error(e);
        });
    }
}

module.exports = PrevTrackCommand;