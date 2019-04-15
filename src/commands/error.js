const Command = require("./command");

exports.ErrorCommand = class ErrorCommand extends Command {
    execute() {
        this.msg.reply(this.error);
    }
};