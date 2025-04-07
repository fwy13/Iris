import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyCWOfQHgTfOuQk-xt8hJaeINLEoMY6in6o",
    authDomain: "dailyland-c7919.firebaseapp.com",
    projectId: "dailyland-c7919",
    storageBucket: "dailyland-c7919.firebasestorage.app",
    messagingSenderId: "981703966597",
    appId: "1:981703966597:web:371bb0ca95aa80f6824eec",
    measurementId: "G-4EQSSZZJHE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };