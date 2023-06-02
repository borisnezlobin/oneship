import express from 'express';
const app = express();
import cors from 'cors';
import { getInfocusNews, getPublication } from './getNews.js';
import { getCalendar, getScheduleForDay } from './getCalendar.js';
import { DEFAULT_SETTINGS, readData, writeData } from './db.js';
import { checkForBadData, getTodayInFunnyFormat } from './util.js';
import { loginUser } from './auth.js';

app.use(cors());

app.get("/version", (_, response) => {
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

app.get('/api/news', async (_, response) => {
    const data = await readData("app", "daily");
    var invalid = checkForBadData(data);
    if(invalid) return res.status(409).send({
        error: "Data not in expected state",
        message: invalid
    });
    res.status(200).send(data.data().news);
});

app.get('/api/schedule/:day', async (request, response) => {
    var data = await readData("app", "daily");
    var invalid = checkForBadData(data);
    if(invalid) return res.status(409).send({
        error: "Data not in expected state",
        message: invalid
    });
    res.status(200).send(data.data().schedule);
});

app.get('/api/calendar', async (_, response) => {
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
app.get('/api/startup', async (_, response) => {
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
app.use('/api/poll', async (_, response) => {
    await startServerToday();
    res.status(200).send({ status: "ok" });
});

app.post("/api/register", async (request, response) => {
    // TODO: require token
    const body = request.body;
    console.log(body);
    const email = body.email;
    const displayName = body.displayName;
    const uid = body.uid;
    const pfp = body.pfp;
    if(email == null || displayName == null || uid == null) return res.status(400).send({ error: "Missing required fields" });
    if(email.split("@")[1] != "pausd.us") return res.status(403).send({ error: "Email must be a PAUSD email" });
    console.log("received request to register user " + uid + " with email " + email + " and display name " + displayName + "");
    var obj = {
        email,
        displayName,
        uid,
        pfp,
        ...DEFAULT_SETTINGS
    };
    await writeData("users", uid, obj);
    res.status(200).send(obj);
});

app.post("/api/login", async (request, response) => {
    const { email, password } = request.body;
    console.log("logging in user " + email + " with password " + password);
    const result = await loginUser(email, password);
    if(result.status == 200){
        const userData = await readData("users", result.message.localId);
        if(userData.exists){
            res.status(200).send({
                data: userData.data(),
                token: result.idToken,
                refreshToken: result.refreshToken
            });
        }else{
            res.status(500).send({
                error: "User with id " + result.message.localId + " does not exist in the database",
            });
        }
    }else{
        res.status(result.status).send({
            error: result.message,
        });
    }
});

app.get('/', (_, response) => {
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