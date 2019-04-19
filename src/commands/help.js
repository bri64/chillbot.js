const Command = require("./command");
const {RichEmbed} = require("discord.js");

exports.HelpCommand = class HelpCommand extends Command {
    constructor(params) {
        super(params);
    }

    async execute(params) {
        await super.execute(params);
        let Commands = this.Commands;
        let fields = [];

        Object.keys(Commands).sort().forEach((command) => {
            let help = Commands[command].help();
            if (help) {
                fields.push({
                    name: `${help.name}`,
                    value:  `\`\`\`Description: ${help.description}\nUsage: ${help.usage}\nAliases: [${Commands[command].aliases().map(alias => `${alias.toLowerCase()}`).join(", ")}]\`\`\`\n`,
                    inline: false,
                });
            }
        });
        this.msg.member.send(new RichEmbed({
            title: '**Commands:**',
            fields,
            color: 0x2C7BEA
        }));
    }

    static aliases() {
        return ["HELP", "COMMANDS"];
    }

    static help() {
        return {
            name: "Help",
            description: 'Sends a DM with this message.',
            usage: "!help",
        };
    }
};