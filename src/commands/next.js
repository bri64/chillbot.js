const Command = require("./command");

class NextTrackCommand extends Command {
    execute() {
        this.musicManager.nextTrack()
            .catch((e) => {
                console.error(e);
            });
    }
}

module.exports = NextTrackCommand;