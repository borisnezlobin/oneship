import admin from 'firebase-admin';

const DEFAULT_SETTINGS = {
    "grade": null,
    "show0": false,
    '0 Period': {
        "customName": "0 Period",
        "teacher": null,
        "room": null,
    },
    '1st Period': {
        "customName": "1 Period",
        "teacher": null,
        "room": null,
    },
    '2nd Period': {
        "customName": "2 Period",
        "teacher": null,
        "room": null,
    },
    '3rd Period': {
        "customName": "3 Period",
        "teacher": null,
        "room": null,

    },
    '4th Period': {
        "customName": "4 Period",
        "teacher": null,
        "room": null,
    },
    '5th Period': {
        "customName": "5 Period",
        "teacher": null,
        "room": null,
    },
    '6th Period': {
        "customName": "6 Period",
        "teacher": null,
        "room": null,
    },
    '7th Period': {
        "customName": "7 Period",
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

const readData = async (collection, document) => {
    // ctf code irl
    return await db.collection(collection).doc(document).get();
}

export { writeData, readData, DEFAULT_SETTINGS };