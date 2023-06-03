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
        "customName": "1st Period",
        "teacher": null,
        "room": null,
    },
    '2nd Period': {
        "customName": "2nd Period",
        "teacher": null,
        "room": null,
    },
    '3rd Period': {
        "customName": "3rd Period",
        "teacher": null,
        "room": null,

    },
    '4th Period': {
        "customName": "4th Period",
        "teacher": null,
        "room": null,
    },
    '5th Period': {
        "customName": "5th Period",
        "teacher": null,
        "room": null,
    },
    '6th Period': {
        "customName": "6th Period",
        "teacher": null,
        "room": null,
    },
    '7th Period': {
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

const readData = async (collection, document) => {
    // ctf code irl
    return await db.collection(collection).doc(document).get();
}

export { writeData, readData, DEFAULT_SETTINGS };