const Command = require("./command");

class PrevTrackCommand extends Command {
    execute() {
        this.musicManager.prevTrack()
            .catch((e) => {
                console.error(e);
            });
    }
}

module.exports = PrevTrackCommand;