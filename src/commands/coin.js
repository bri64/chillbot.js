const Command = require("./command");

exports.CoinCommand = class CoinCommand extends Command {
    async execute(params) {
        await super.execute(params);
        let coin = !!Math.round(Math.random());
        this.msg.channel.send(`${coin ? "Heads" : "Tails"}!`)
    }

    static aliases() {
        return ["COIN", "FLIP", "HEADS", "TAILS"];
    }
};