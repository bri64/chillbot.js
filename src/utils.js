class Utils {
    static getCurrentVoiceChannels(user, guild) {
        return guild.channels
            .filter(channel => channel.type === "voice")
            .filter(channel => channel.members != null)
            .filter(channel => channel.members.array().length > 0)
            .filter(channel => channel.members.array().map(member => member.user).includes(user));
    }

    static shuffleArray(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}

module.exports = Utils;