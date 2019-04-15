const Command = require("./command");

class ErrorCommand extends Command {
    execute() {
        this.msg.reply(this.error);
    }
}

module.exports = ErrorCommand;