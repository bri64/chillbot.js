
class EventListener {
    constructor(client) {
        this.client = client;
        this.CommandManager = new (require("./command-manager"))(client);
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


