const Command = require("./command");

class PlayCommand extends Command {
    constructor(params) {
        super(params);
        Object.assign(this, params);
    }

    execute() {
        this.musicManager.addToQueue(this.url, this.member, true).then(() => {
            this.channel.send("Now playing!");
        })
        .catch(() => {
            this.channel.send("Failed to load URL!");
        });
    }
}

module.exports = PlayCommand;