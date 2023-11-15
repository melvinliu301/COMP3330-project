import { app } from "./base";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

const db = getFirestore(app);

const addData = (collectionName, data) => {
    addDoc(collection(db, collectionName), data)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
};

const getData = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs;
};

export { addData, getData };
