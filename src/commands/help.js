const Command = require("./command");

const {RichEmbed} = require("discord.js");
const help = new RichEmbed({
    title: 'Commands:',
    fields: [
        {
            name: "* **Play**",
            value:
                "Description: Queues song/playlist and starts immediately. \n"
                + "Usage: !play URL \n",
            inline: true
        },
        {
            name: "* **Queue**",
            value:
                "Description: Queues song/playlist, adding it to the end. \n"
                + "Usage: !queue URL \n",
            inline: true
        },
        {
            name: "* **Kill**",
            value:
                "Description: Clears the queue and leaves the channel. \n"
                + "Usage: !kill \n",
            inline: true
        },
        {
            name: "* **Next**",
            value:
                "Description: Plays the next song in the queue. \n"
                + "Usage: !next \n",
            inline: true
        }
        ]
    });
exports.HelpCommand = class HelpCommand extends Command {
    constructor(params) {
        super(params);
    }

    async execute(params) {
        await super.execute(params);
        let Commands = this.Commands;
        let fields = [];

        Object.keys(Commands).forEach((command) => {
            let help = Commands[command].help();
            if (help) {
                fields.push({
                    name: help.name,
                    value:  `
                                Description: ${help.description}
                                Usage: ${help.usage}
                                Aliases: [${Commands[command].aliases().map(alias => `${alias.toLowerCase()}`).join(", ")}]\n
                            `,
                    inline: false,
                });
            }
        });
        this.msg.member.send(new RichEmbed({
            title: 'Commands:',
            fields,
            color: 0x2C7BEA
        }));
    }

    static aliases() {
        return ["HELP", "COMMANDS"];
    }
};