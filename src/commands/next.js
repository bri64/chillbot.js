const Command = require("./command");

class NextTrackCommand extends Command {
    constructor(params) {
        super(params);
        Object.assign(this, params);
    }

    execute() {
        this.musicManager.nextTrack().then(() => {

        })
        .catch((e) => {
            console.error(e);
        });
    }
}

module.exports = NextTrackCommand;