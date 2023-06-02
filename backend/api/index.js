import express from 'express';
const app = express();
import cors from 'cors';
import { getInfocusNews, getPublication } from './getNews.js';
import { getCalendar, getScheduleForDay } from './getCalendar.js';
import { readData, writeData } from './db.js';
import { checkForBadData, getTodayInFunnyFormat } from './util.js';

app.use(cors());

app.get("/version", (_, res) => {
    // look at me using semver
    // correctly
    res.status(200).send({
        current: "0.0.0",
        min: "0.0.0",
        alpha: "0.0.1-alpha",
        beta: "0.0.1-beta",
        server: "0.0.1-alpha"
    });
});

const getNews = async () => {
    const palyVoice = await getPublication("https://palyvoice.com/?s=");
    const cMag = await getPublication("https://cmagazine.org/?s=");
    const vikingMag = await getPublication("https://vikingsportsmag.com/?s=");
    const verde = await getPublication("https://verdemagazine.com/?s=", "C Magazine");
    const infocus = await getInfocusNews();
    return [
        { title: "Verde", articles: verde },
        { title: "Viking Magazine", articles: vikingMag },
        { title: "C Magazine", articles: cMag },
        { title: "Paly Voice", articles: palyVoice },
        { title: "InFocus", articles: infocus }
    ];
}

app.get('/api/news', async (_, res) => {
    const data = await readData("app", "daily");
    var invalid = checkForBadData(data);
    if(invalid) return res.status(409).send({
        error: "Data not in expected state",
        message: invalid
    });
    res.status(200).send(data.data().news);
});

app.get('/api/schedule/:day', async (req, res) => {
    var data = await readData("app", "daily");
    var invalid = checkForBadData(data);
    if(invalid) return res.status(409).send({
        error: "Data not in expected state",
        message: invalid
    });
    res.status(200).send(data.data().schedule);
});

app.get('/api/calendar', async (_, res) => {
    var data = await readData("app", "daily");
    var invalid = checkForBadData(data);
    if(invalid) return res.status(409).send({
        error: "Data not in expected state",
        message: invalid
    });
    res.status(200).send(data.data().calendar);
});

// called by frontend on startup
// just throw all the data at the app
app.get('/api/startup', async (_, res) => {
    const data = await readData("app", "daily");
    var invalid = checkForBadData(data);
    if(invalid) return res.status(409).send({
        error: "Data not in expected state",
        message: invalid
    });
    res.status(200).send(data.data());
});

// called by https://uptimerobot.com every 12h at 6am + 6pm
// I didn't want to wake up at 5am and set the interval to 24h
app.use('/api/poll', async (_, res) => {
    await startServerToday();
    res.status(200).send({ status: "ok" });
});

app.get('/', (_, res) => {
    res.status(200).send("Server status: runnning");
});

app.listen(8080, () => {
    console.log("Listening on port 3000");
});

const startServerToday = async () => {
    // get all data needed for app startup
    var calendar = await getCalendar();
    var today = getTodayInFunnyFormat();
    var schedule = await getScheduleForDay("20230411");
    var news = await getNews();
    var data = {
        lastUpdate: getTodayInFunnyFormat(),
        calendar: calendar,
        schedule: { date: today, value: schedule },
        news: news
    };

    // write data to firestore
    await writeData("app", "daily", data);
}

export default app;