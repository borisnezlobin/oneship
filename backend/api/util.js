
const getTodayInFunnyFormat = () => {
    var today = new Date();
    // in format "yyyymmdd"
    today = today.getFullYear() + (today.getMonth() < 10 ? "0" : "") + today.getMonth() + (today.getDate() < 9 ? "0" : "") + today.getDate();
    return today;
};

const checkForBadData = (doc) => {
    if(doc == null) return "document does not exist";
    if(doc.data() == null) return "data() is null";
    if(doc.data().lastUpdate == null) return "lastUpdate is null";
    if(doc.data().lastUpdate != getTodayInFunnyFormat()) return "lastUpdate is not today";
    return false;
}

const messageScore = (message) => {
    var score = 0;

    // score based on post type
    if(message.postType == "ad") score += 1;
    if(message.postType == "event") score += 2;
    if(message.postType == "asb") score += 3;
    if(message.postType == "announcement") score += 4;

    // score based on reach
    if(message.targets.students) score += 1;
    if(message.targets.teachers) score += 1;
    if(message.targets.individuals.length > 0) score += 1;
    if(message.targets.grades.length > 0) score += 1;

    // TODO: score based on how much time is left until expiration?

    return score;
};

export {
    getTodayInFunnyFormat,
    checkForBadData,
    messageScore
};