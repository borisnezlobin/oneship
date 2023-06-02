
const getTodayInFunnyFormat = () => {
    var today = new Date();
    // in format "yyyymmdd"
    today = today.getFullYear() + (today.getMonth() < 9 ? "0" : "") + (today.getMonth() + 1) + (today.getDate() < 9 ? "0" : "") + today.getDate();
    return today;
};

const checkForBadData = (doc) => {
    if(doc == null) return "document does not exist";
    if(doc.data() == null) return "data() is null";
    if(doc.data().lastUpdate == null) return "lastUpdate is null";
    if(doc.data().lastUpdate != getTodayInFunnyFormat()) return "lastUpdate is not today";
    return false;
}

export { getTodayInFunnyFormat, checkForBadData };