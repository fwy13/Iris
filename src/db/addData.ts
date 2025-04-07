import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function addData() {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            name: "John Doe",
            email: "john@example.com",
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}