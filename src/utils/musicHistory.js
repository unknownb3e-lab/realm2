const history = new Map();

function getHistory(guildId) {
    if (!history.has(guildId)) {
        history.set(guildId, []);
    }

    return history.get(guildId);
}

function addHistory(guildId, track) {
    if (!track) return;

    const guildHistory = getHistory(guildId);

    guildHistory.push(track);

    // Maximum 20 previous tracks
    if (guildHistory.length > 20) {
        guildHistory.shift();
    }
}

function getPrevious(guildId) {
    const guildHistory = getHistory(guildId);

    if (guildHistory.length === 0) {
        return null;
    }

    return guildHistory.pop();
}

function clearHistory(guildId) {
    history.delete(guildId);
}

module.exports = {
    addHistory,
    getPrevious,
    getHistory,
    clearHistory
};