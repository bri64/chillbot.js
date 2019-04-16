const Command = require("./command");

exports.VolumeCommand = class VolumeCommand extends Command {
    async execute(params) {
        await super.execute(params);
        let volume = this.args[0];
        try {
            let vol = (volume < 1) ? volume : (volume / 100);
            this.musicManager.setVolume(vol);
        } catch (e) {
            console.error(e);
        }
    }

    static aliases() {
        return ["VOLUME", "SETVOLUME", "MUTE", "VOL"];
    }
};