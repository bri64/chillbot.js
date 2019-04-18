module.exports = class Command {
    constructor(aliases) {
        Object.assign(this, aliases);
    }

    async execute(params) {
        Object.assign(this, params);
    }

    static aliases() {
        return [];
    }

    static help() {
        return {
            name: this.aliases().length > 0 && this.aliases()[0],
            description: 'No Description.',
            usage: 'No Usage Defined!',
        };
    }
};