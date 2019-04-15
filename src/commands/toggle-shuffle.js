const Command = require("./command");

exports.ToggleShuffleCommand = class ToggleShuffleCommand extends Command {
    execute() {
        let yes = [ 'true', 'yes', 'on'  ];
        let no  = [ 'false', 'no', 'off' ];
        if (yes.includes(this.shuffle)) {
            this.musicManager.toggleShuffle(true);
        } else if (no.includes(this.shuffle)) {
            this.musicManager.toggleShuffle(false);
        } else {
            this.msg.reply("Invalid shuffle option. [ true / false ]");
        }
    }
};