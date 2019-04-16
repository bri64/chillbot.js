const Command = require("./command");

exports.ErrorCommand = class ErrorCommand extends Command {
    async execute(params) {
        await super.execute(params);
        let error = this.args[0];
        this.msg.reply(error);
    }
};