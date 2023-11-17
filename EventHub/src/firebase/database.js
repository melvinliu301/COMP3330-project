import { app } from "./base";
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const db = getFirestore(app);
const storage = getStorage();

const addData = async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
};

const setData = async (collectionName, id, data) => {
    await setDoc(doc(db, collectionName, id), data);
};

// e.g.
// const data = await getData("users");
// data.forEach((doc) => {
//     console.log(doc.id, " => ", doc.data());
// });
// doc.id is the id of the document to be used in updateData
// the doc.data() is an object with the data from the document
// for example { test1: "test1", test2: "test2" } and can access test1 using doc.data().test1
const getData = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs;
};

const updateData = async (collectionName, id, data) => {
    const docRef = await updateDoc(doc(db, collectionName, id), data);
    return docRef.id;
};

const getBinaryURL = async (path) => {
    const starsRef = ref(storage, path);
    try {
        const url = await getDownloadURL(starsRef);
        return url;
    } catch (err) {
        return null;
    }
};

export { addData, setData, getData, updateData, getBinaryURL };
