import { app } from "./base";
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    getDoc,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

const storage = getStorage();

const db = getFirestore(app);

const addData = async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
};

const setData = async (collectionName, id, data) => {
    await setDoc(doc(db, collectionName, id), data);
};

const uploadFileFromLocalURI = async (localURI, path) => {
    let blob = await fetch(localURI).then(r => r.blob());
    await uploadBytes(ref(storage, path), blob);
}

const getBinaryURL = async (path) => {
    const starsRef = ref(storage, path);
    try {
        const url = await getDownloadURL(starsRef);
        return url;
    } catch (err) {
        return null;
    }
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

const getDataById = async (collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else{
        return null;
    }
}

const updateData = async (collectionName, id, data) => {
    const docRef = await updateDoc(doc(db, collectionName, id), data);
    return docRef.id;
}

export {addData, setData, getData, updateData, getDataById, getBinaryURL, uploadFileFromLocalURI};
