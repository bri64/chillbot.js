class EventListener {
    constructor(client, musicManager, commandManager) {
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
}

module.exports = EventListener;