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
    if(message.postType == "oneship") score += 5;

    // score based on reach
    if(message.targets.students) score += 1;
    if(message.targets.teachers) score += 1;
    if(message.targets.individuals.length > 0) score += 1;
    if(message.targets.grades.length > 0) score += 1;

    // mhm
    // there's nothing you can do
    if(message.featured) score += 10000;

    return score;
};

// did I just write a function that I don't need?
// const requireAuthed = async (request, response, next) => {
//     var body = request.body;
//     if(body.token == null) return response.status(401).send("No token provided");
//     const res = await verifyToken(body.token);
//     if(res == null) return response.status(401).send("Invalid token");
//     request.uid = res.uid;
//     delete request.body.token;
//     next();
// };

export {
    getTodayInFunnyFormat,
    checkForBadData,
    messageScore,
};