// require firestore
import admin from 'firebase-admin';

// initialize firestore
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

export { writeData, readData };