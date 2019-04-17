const Command = require("./command");

const {RichEmbed} = require("discord.js");
const help = new RichEmbed({
    title: 'Commands:',
    fields: [
        {
            name: "- Play",
            value:
                "Description: Queues song/playlist and starts immediately. \n"
                + "Usage: !play URL \n"
                + "Aliases: [play]",
            inline: true
        },
        {
            name: "- Queue",
            value:
                "Description: Queues song/playlist, adding it to the end. \n"
                + "Usage: !queue URL \n"
                + "Aliases: [queue, add]",
            inline: true
        },
    ],
    color: 0x2C7BEA
});
exports.HelpCommand = class HelpCommand extends Command {
    async execute(params) {
        await super.execute(params);
        this.msg.member.send(help);
    }

    static aliases() {
        return ["HELP", "COMMANDS"];
    }
};