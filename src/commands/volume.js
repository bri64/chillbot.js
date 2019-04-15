const Command = require("./command");

class VolumeCommand extends Command {
    async execute() {
        try {
            let volume = (this.volume < 1) ? this.volume : (this.volume / 100);
            this.musicManager.setVolume(volume);
        } catch(e) {
            console.error(e);
        }
    }
}

module.exports = VolumeCommand;