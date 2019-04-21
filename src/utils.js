module.exports = class Utils {
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

    static async clearReaction(msg, user) {
        await msg.reactions.forEach(async (reaction) => await reaction.remove(user));
    }

    static async clearReactions(msg, own) {
        if (own)
            await this.clearReaction(msg, msg.user);
        msg.reactions.forEach(reaction => {
            // TODO: No Permission
            reaction.users
                .filter(user => (user.id !== msg.member.user.id))
                .forEach(async (user) => await this.clearReaction(msg, user));
        });
    }
};