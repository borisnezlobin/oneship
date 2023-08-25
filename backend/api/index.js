import express from 'express';
const app = express();

import { getInfocusNews, getPublication } from './getNews.js';
import { getCalendar, getScheduleForDay } from './getCalendar.js';
import { DEFAULT_SETTINGS, createMessage, getErrors, getMessage, getMessagesForUser, readData, updateData, updateSettings, writeData } from './db.js';
import { checkForBadData, getTodayInFunnyFormat } from './util.js';
import { loginUser } from './auth.js';
import { getSports } from './getSports.js';

if(process.env.ENVIRONMENT == "PROD"){
    console.log("running in prod");
    app.use(express.json());
}

app.get("/version", (_, response) => {
    // look at me using semver
    // correctly
    response.status(200).send({
        current: "0.0.1",
        min: "0.0.0",

        // currently unused
        alpha: "0.0.1-alpha",
        beta: "0.0.1-beta",
        server: "0.0.1-alpha"
    });
});

const getNews = async () => {
    const palyVoice = await getPublication("https://palyvoice.com/?s=");
    const cMag = await getPublication("https://cmagazine.org/?s=");
    const vikingMag = await getPublication("https://vikingsportsmag.com/?s=");
    const verde = await getPublication("https://verdemagazine.com/?s=");
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
    if(invalid) return response.status(409).send({
        error: "Data not in expected state",
        message: invalid
    });
    response.status(200).send(data.data().news);
});

app.get('/api/schedule/:day', async (request, response) => {
    var data = await readData("app", "daily");
    var invalid = checkForBadData(data);
    if(invalid) return response.status(409).send({
        error: "Data not in expected state",
        message: invalid
    });
    response.status(200).send(data.data().schedule);
});

app.get('/api/calendar', async (_, response) => {
    var data = await readData("app", "daily");
    var invalid = checkForBadData(data);
    if(invalid) return response.status(409).send({
        error: "Data not in expected state",
        message: invalid
    });
    response.status(200).send(data.data().calendar);
});

// called by frontend on startup
// just throw all the data at the app
app.get('/api/startup', async (_, response) => {
    try{
        var data = await readData("app", "daily");
        var invalid = checkForBadData(data);
        if(invalid){ return response.status(500).send({ error: "Data not in expected state", message: invalid }); }
        data = data.data();
        console.log("sending startup data");
        console.log("calendar: " + data.calendar.length + " events" + " | schedule: " + (data.schedule.value == null ? "none today" : data.schedule.value.length + " periods") + " | news: " + data.news.length + " publications");
        console.log("data lastUpdate: " + data.lastUpdate + " | today: " + getTodayInFunnyFormat());
        response.status(200).send(data);
    }catch(e){
        console.log(e);
        console.log("error sending startup data");
        response.status(500).send({ error: e });
    }
});

app.post("/api/register", async (request, response) => {
    // TODO: require token
    const body = request.body;
    console.log(body);
    const email = body.email;
    const displayName = body.displayName;
    const uid = body.uid;
    const pfp = body.pfp;
    if(email == null || displayName == null || uid == null) return response.status(400).send({ error: "Missing required fields" });
    if(email.split("@")[1] != "pausd.us") return response.status(403).send({ error: "Email must be a PAUSD email" });
    console.log("received request to register user " + uid + " with email " + email + " and display name " + displayName + ".");
    var obj = {
        ...DEFAULT_SETTINGS,
        email,
        displayName,
        uid,
        pfp,
    };
    await writeData("users", uid, obj);
    const messages = await getMessagesForUser(obj);
    response.status(200).send({
        data: obj,
        messages
    });
});

app.post("/api/login", async (request, response) => {
    const email = request.body.email;
    const password = request.body.password;
    const ua = request.body.ua;
    // const email = request.query.email;
    // const password = request.query.password;
    if(email == null || password == null) return response.status(400).send({ error: "Missing required fields" });
    console.log("logging in user " + email + " with password " + password + ". User agent: " + ua);
    const result = await loginUser(email, password);

    // the following lines are like that for testing, google won't let me use my pausd account
    // for some reason, will have to email someone at PAUSD sometime
    var fakeAuth = process.env.USE_DUMMY_AUTH == "true";
    var fakePassword = process.env.DUMMY_PASSWORD;
    var useDummyAuth = fakeAuth && password == fakePassword;
    if(useDummyAuth) console.log("using dummy auth");
    if(useDummyAuth || result.status == 200){
        var uid = useDummyAuth ? "S8zqWKYuX1TAP1dUBgbGE3ynLIv1" : result.message.localId;
        var userData = await readData("users", uid);
        if(userData.exists){
            userData = userData.data();
            
            // verify that userData contains all keys in DEFAULT_SETTINGS
            const keys = Object.keys(DEFAULT_SETTINGS);
            var changed = false;
            for(var i = 0; i < keys.length; i++){
                if(userData[keys[i]] == null){
                    changed = true;
                    userData[keys[i]] = DEFAULT_SETTINGS[keys[i]];
                }
            }
            if(changed) await writeData("users", uid, userData);
            if(ua && !userData.userAgents.includes(ua)){
                userData.userAgents.push(ua);
                await writeData("users", uid, userData);
            }
            const messages = await getMessagesForUser(userData);
            response.status(200).send({
                data: userData,
                messages,
                token: result.idToken,
                refreshToken: result.refreshToken
            });
        }else{
            response.status(500).send({
                error: "User with id " + result.message.localId + " does not exist in the database",
            });
        }
    }else{
        response.status(result.status).send({
            error: result.message,
        });
    }
});

app.get("/api/post/:postid", async (request, response) => {
    const post = await getMessage(request.params.postid);
    if(post == null) return response.status(404).send({ error: "Post not found." });
    response.status(200).send(post);
});

app.post("/api/user/settings", async (request, response) => {
    const body = request.body;
    const uid = body.uid;
    const settings = body.settings;
    const token = body.token;
    // if(uid !== "S8zqWKYuX1TAP1dUBgbGE3ynLIv1"){
    //     if(!token) return response.status(403).send({ error: "Missing id token" });
    //     if(verifyToken(token) != uid) return response.status(403).send({ error: "Invalid id token" });
    // }
    if(uid == null || settings == null) return response.status(400).send({ error: "Missing required fields" });
    console.log("received request to update settings for user " + uid);
    const result = await updateSettings(uid, settings);
    response.status(result.status).send(result.message);
});

app.post("/api/create-message", async (request, response) => {
    const body = request.body;
    console.log(body);
    const result = await createMessage(body);
    response.status(result.status).send(result.message);
});

app.post("/report-error", async (request, response) => {
    // format: { error: "error message", logs: "stack trace", status: "status code". userAgent: "user agent", userName: "user name" }
    const body = request.body;
    console.log("Error reported: " + body);
    // verify that body contains all required fields
    // the frontend always sends all fields, but just in case some goofy high schoolers decide to try and hack me
    // I know they will
    // but I WILL be ready
    // they will NOT win
    const keys = Object.keys(body);
    const requiredKeys = ["error", "logs", "status", "userAgent"];
    for(var i = 0; i < requiredKeys.length; i++){
        if(!keys.includes(requiredKeys[i])){
            return response.status(400).send({ error: "Invalid Error: missing key: " + requiredKeys[i]  });
        }
    }
    
    await writeData("errors", new Date().toString(), body);
    response.status(200).send({ message: "Error Reported!" });
});

app.get('/', async (_, response) => {
    const errors = await getErrors();
    response.status(
        errors.length > 0 ? 500 : 200
    ).send("<center><h1>Server status: " + (errors.length > 0 ? "error" : "ok") + "</h1></center><hr /><b>Errors:</b>" + (
        errors.map(e => "<p>" + e.error + " | " + e.status + " | " + e.userAgent + "</p>").join("\n")
    ));
});

// takes 25 seconds to fetch 2 months in advance (locally)
// vercel has 10s limit, so just run this every now and then locally I guess
app.use("/api/poll/sports", async (_, response) => {
    console.log("fetched sports");
    var sports = await getSports();
    await updateData("app", "daily", {
        sports: sports
    });
    response.status(200).send("updated sports");
});

app.use("/api/poll/calendar", async (_, response) => {
    var today = getTodayInFunnyFormat();
    var calendar = await getCalendar();
    var schedule = getScheduleForDay(today, calendar);
    var obj = {
        calendar: calendar,
        lastUpdate: today,
        schedule: {
            date: today,
            value: schedule
        }
    };
    await updateData("app", "daily", obj);
    return response.status(200).send("updated calendar and schedule");
});

app.use("/api/poll/news", async (_, response) => {
    var news = await getNews();
    await updateData("app", "daily", {
        news: news,
    });
    response.status(200).send("updated news");
});

app.use('/api/poll', async (_, response) => {
    var today = getTodayInFunnyFormat();
    await updateData("app", "daily", {
        lastUpdate: today,
    });
    response.status(200).send({ status: "ok" });
});

const getURL = () => {
    var url = "https://google.com";
    if(process.env.ENVIRONMENT == "PROD"){
        url = "https://oneship.vercel.app/api/poll";
    }else{
        url = "http://localhost:5000/api/poll";
    }

    return url;
}

export default app;