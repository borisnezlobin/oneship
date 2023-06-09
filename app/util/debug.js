var logs = [];

function log(str) {
    console.log(str);
    logs.push({
        log: str,
        type: "info",
        time: new Date(),
    });
}

function logError(str) {
    console.error(str);
    logs.push({
        log: str,
        type: "error",
        time: new Date(),
    });
}

function getLogs() {
    return [...logs]; // return an object instead of a reference
}

export default log;

export { getLogs, logError };