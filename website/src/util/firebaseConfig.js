import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAImO1-wa91lni3qU8B436se-OfJBpx9vU",
  authDomain: "palo-alto-high-school.firebaseapp.com",
  projectId: "palo-alto-high-school",
  storageBucket: "palo-alto-high-school.appspot.com",
  messagingSenderId: "952486015120",
  appId: "1:952486015120:web:bec3ef4aecd9b409836815"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;