import express from 'express';
const app = express();
import cors from 'cors';
import { getInfocusNews, getPublication } from './getNews.js';
import { getCalendar, getScheduleForDay } from './getCalendar.js';

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

app.get('/api/news', async (_, res) => {
    const palyVoice = await getPublication("https://palyvoice.com/?s=");
    const cMag = await getPublication("https://cmagazine.org/?s=");
    const vikingMag = await getPublication("https://vikingsportsmag.com/?s=");
    const verde = await getPublication("https://verdemagazine.com/?s=", "C Magazine");
    const infocus = await getInfocusNews();
    res.status(200).send([
        { title: "Verde", articles: verde },
        { title: "Viking Magazine", articles: vikingMag },
        { title: "C Magazine", articles: cMag },
        { title: "Paly Voice", articles: palyVoice },
        { title: "InFocus", articles: infocus }
    ]);
});

app.get('/api/schedule/:day', async (req, res) => {
    var schedule = await getScheduleForDay(req.params.day);
    if(schedule == null) return res.status(404).send({ error: "Schedule not found" });
    res.status(200).send(schedule);
});

app.get('/api/calendar', async (_, res) => {
    var calendar = await getCalendar();
    res.status(200).send(calendar);
});

app.get('/', (_, res) => {
    res.status(200).send("Server status: runnning");
});

app.listen(8080, () => {
    console.log("Listening on port 3000");
});

export default app;