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

    static clearReaction(msg, user) {
        msg.reactions.forEach(reaction => reaction.remove(user));
    }

    static clearReactions(msg, own) {
        msg.reactions.filter(reaction => own || !reaction.me).forEach(reaction => {
            if (own)
                this.clearReaction(msg, msg.user);
            // TODO: No Permission
            // reaction.users.forEach(user => this.clearReaction(user));
        });
    }
};