class EventListener {
    constructor(client, musicManager) {
        this.client = client;
        this.commandManager = new (require("./command-manager"))(client, musicManager);
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