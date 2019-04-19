module.exports = class EventListener {
    constructor(client, shardManager, commandManager) {
        this.client = client;
        this.commandManager = commandManager;
    }

    init() {
        // Messages
        this.client.on("message", msg => {
            this.commandManager.parseCommand(msg).catch(e => console.error(e));
        });

        // Other
    }
};