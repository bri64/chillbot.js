const Command = require("./command");

class CoinCommand extends Command {
    constructor(params) {
        super(params);
        this.channel = params.channel;
    }

    execute() {
        let coin = !!Math.round(Math.random());
        this.channel.send(`${coin ? "Heads" : "Tails" }!`)
    }
}

module.exports = CoinCommand;