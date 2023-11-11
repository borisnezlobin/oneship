import admin from 'firebase-admin';
import fetch from 'node-fetch';

admin.initializeApp({
    credential: admin.credential.cert(
        JSON.parse(process.env.ADMIN_SDK)
    ),
}, "authentication");

const auth = admin.auth();

// attempts to sign in a user with email and password, returns a status code and a message
// if status code is 200, message is the user's uid
const loginUser = async (email, password) => {
    const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + process.env.WEB_API_KEY,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        }
    );
    const json = await res.json();
    console.log(json);
    if(res.status != 200){
        return {
            status: res.status,
            message: json
        }
    }
    return {
        status: 200,
        message: json
    }
};

const verifyToken = async (token) => {
    const res = await auth.verifyIdToken(token);
    return res;
};

const ADMIN_UIDS = JSON.parse(process.env.ADMIN_UIDS);

const requireAdmin = async (request, response, next) => {
    const token = request.headers.authorization;
    if(!token){
        response.status(401).send("No token provided");
        return;
    }
    const decoded = await verifyToken(token);
    if(!ADMIN_UIDS.includes(decoded.uid)){
        response.status(403).send("Unauthorized ID token provided.");
        return;
    }
    next();
};

export {
    loginUser,
    verifyToken,
    requireAdmin
}