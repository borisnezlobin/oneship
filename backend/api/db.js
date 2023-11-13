import admin from 'firebase-admin';
import { messageScore } from './util.js';
import { v4 } from 'uuid';

const DEFAULT_SETTINGS = {
    "email": "",
    "displayName": "",
    "userAgents": [],
    "uid": "",
    "pfp": "",
    "classNotification": 5,
    "grade": -1,
    "show0": false,
    "wantsMobile": false,
    '0 period': {
        "customName": "0 Period",
        "teacher": null,
        "room": null,
    },
    '1st period': {
        "customName": "1st Period",
        "teacher": null,
        "room": null,
    },
    '2nd period': {
        "customName": "2nd Period",
        "teacher": null,
        "room": null,
    },
    '3rd period': {
        "customName": "3rd Period",
        "teacher": null,
        "room": null,

    },
    '4th period': {
        "customName": "4th Period",
        "teacher": null,
        "room": null,
    },
    '5th period': {
        "customName": "5th Period",
        "teacher": null,
        "room": null,
    },
    '6th period': {
        "customName": "6th Period",
        "teacher": null,
        "room": null,
    },
    '7th period': {
        "customName": "7th Period",
        "teacher": null,
        "room": null,
    },
}

admin.initializeApp({
    credential: admin.credential.cert(
        JSON.parse(process.env.ADMIN_SDK)
    ),
});

// get firestore instance
const db = admin.firestore();

const writeData = async (collection, document, data) => {
    console.log("writing to " + collection + "/" + document);
    await db.collection(collection).doc(document).set(data);
}

const updateData = async (collection, document, data) => {
    console.log("updating " + collection + "/" + document);
    await db.collection(collection).doc(document).set(data, { merge: true });
}

const readData = async (collection, document) => {
    // ctf code irl
    return await db.collection(collection).doc(document).get();
}

const getMessagesForUser = async (userData) => {
    var messages = await db.collection("messages").get();
    messages = messages.docs.map(doc => doc.data());
    messages = messages.filter(message => {
        return (message.targets.individuals.includes(userData.uid) ||
        message.targets.grades.includes(parseInt(userData.grade)) ||
        (message.targets.students && userData.email.split("@")[1] == "pausd.us") ||
        (message.targets.teachers && userData.email.split("@")[1] == "pausd.org")) &&
        message.expires > Date.now();
    })
    messages = messages.sort((a, b) => {
        return messageScore(b) - messageScore(a);
    });
    return messages;
}

const getMessage = async (messageId) => {
    const message = await db.collection("messages").doc(messageId).get();
    if(!message.exists) return null;
    return message.data();
}

const createMessage = async (message) => {
    // message is in the format {
    //     sender: "name",
    //     targets: {
    //         students: Boolean,
    //         teachers: Boolean,
    //         grades: [grade1, grade2, grade3],
    //         individuals: [uid1, uid2, uid3],
    //     }
    //     description: "description",
    //     content: "message", // in pseudo-markdown
    //     title: "title",
    //     attachments: [url1, url2, url3],
    //     postType: "oneship" | "announcement" | "event" | "ad" | "asb",
    //     expires: Date,
    // }

    if(message.expires == null) message.expires = Date.now() + 1000 * 60 * 60 * 24 * 7; // default to 1 week from now
    // verify that all required fields are present
    if(message.sender == null || message.description == null || message.expires == null || message.targets == null || message.content == null || message.title == null || message.postType == null) return { status: 400, message: "Missing required fields" };
    // verify that all required fields are correct type
    if(typeof message.sender != "string" || typeof message.description != "string" || typeof message.expires != "number" || typeof message.targets != "object" || typeof message.content != "string" || typeof message.title != "string" || typeof message.postType != "string") return { status: 400, message: "Incorrect field types" };
    // verify that all required fields are valid
    if(message.sender.length == 0 || message.description.trim().length < 10 || message.content.length == 0 || message.title.length == 0) return { status: 400, message: "Required fields cannot be empty" };
    // verify that message.expires is a valid date
    if(message.expires < Date.now()) return { status: 400, message: "Message cannot expire in the past" };

    try{
        message.id = v4();
        await db.collection("messages").doc(message.id).create({
            ...message,
            created: admin.firestore.FieldValue.serverTimestamp(),
            featured: false,
        });
        return { status: 200, message: "Message created successfully" };
    } catch(e) {
        return { status: 500, message: e };
    }
}

const getErrors = async () => {
    var errors = await db.collection("errors").get();
    errors = errors.docs.map(doc => doc.data());
    return errors;
};

const updateSettings = async (uid, settings) => {
    // check that all keys are present against DEFAULT_SETTINGS
    for(const key in DEFAULT_SETTINGS) {
        if(settings[key] == null) settings[key] = DEFAULT_SETTINGS[key];
    }
    await db.collection("users").doc(uid).set(settings);

    return { status: 200, message: "Settings updated successfully" };
}

export {
    writeData,
    updateData,
    readData,
    getMessagesForUser,
    getMessage,
    createMessage,
    getErrors,
    updateSettings,
    DEFAULT_SETTINGS
};