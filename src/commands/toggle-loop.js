const Command = require("./command");
const LoopMode = require("../enums/loop-mode");

exports.ToggleLoopCommand = class ToggleLoopCommand extends Command {
    async execute(params) {
        await super.execute(params);

        if (this.args.length === 0) {
            let newMode = this.musicManager.toggleLoop(this.guild).toLowerCase();
            this.msg.reply(`Loop set to ${newMode}.`);
        } else {
            let loop = this.args[0].toUpperCase();
            if (Object.keys(LoopMode).includes(loop)) {
                this.musicManager.setLoop(this.guild, loop);
                this.msg.reply(`Loop set to ${loop.toLowerCase()}.`);
            } else {
                this.msg.reply("Invalid loop option. [ none / all / one ]");
            }
        }
    }

    static aliases() {
        return ["LOOP", "LOOPMODE", "SETLOOP", "TOGGLELOOP", "REPEAT"];
    }

    static help() {
        return {
            name: "Toggle Loop",
            description: "Toggles the loop mode or sets it to the specified mode.",
            usage: "!loop [none|all|one]",
        };
    }
};