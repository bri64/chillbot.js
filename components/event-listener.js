class EventListener {
    constructor(client, musicManager) {
        this.client = client;
        this.CommandManager = new (require("./command-manager"))(client, musicManager);
    }

    init() {
        // Messages
        this.client.on("message", msg => {
            this.CommandManager.parseCommand(msg);
        });

        // Other
    }
}

module.exports = EventListener;