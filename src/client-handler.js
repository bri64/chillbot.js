
class ClientHandler {
    constructor(client, token) {
        this.client = client;
        this.token = token;
    }

    setup() {
        return new Promise((resolve, reject) => {
            this.client.on('error', (error) => {
                reject(error);
            });

            this.client.on('ready', () => {
                resolve(`Logged in as ${this.client.user.tag}!`);
                setTimeout(async () => {
                    await this.client.user.setStatus('idle');
                    await this.client.user.setActivity('🎵 No Songs Playing', { type: "LISTENING" });
                });
            });

            this.client.login(this.token).catch((error) => {
                reject(error);
            });
        });
    }
}

module.exports = ClientHandler;

