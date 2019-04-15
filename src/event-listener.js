class EventListener {
    constructor(client, musicManager, commandManager) {
        this.client = client;
        this.commandManager = commandManager;
    }

    init() {
        // Messages
        this.client.on("message", msg => {
            this.commandManager.parseCommand(msg);
        });

        // Other
    }
}

module.exports = EventListener;