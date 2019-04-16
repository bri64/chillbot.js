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
};