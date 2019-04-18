const Command = require("./command");

exports.ToggleShuffleCommand = class ToggleShuffleCommand extends Command {
    async execute(params) {
        await super.execute(params);
        let shuffle = this.args[0];
        let yes = ['true', 'yes', 'on'];
        let no = ['false', 'no', 'off'];
        if (yes.includes(shuffle)) {
            this.musicManager.toggleShuffle(this.guild, true);
        } else if (no.includes(shuffle)) {
            this.musicManager.toggleShuffle(this.guild, false);
        } else {
            this.msg.reply("Invalid shuffle option. [ true / false ]");
        }
    }

    static aliases() {
        return ["TOGGLESHUFFLE", "SETSHUFFLE"];
    }

    static help() {
        return {
            name: "Toggle Shuffle",
            description: "Toggles whether incoming playlists should be shuffled (default: true).",
            usage: '!toggleshuffle (true,yes,on|false,no,off)',
        };
    }
};