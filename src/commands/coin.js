const Command = require("./command");

exports.CoinCommand = class CoinCommand extends Command {
    execute() {
        let coin = !!Math.round(Math.random());
        this.msg.channel.send(`${coin ? "Heads" : "Tails" }!`)
    }
};