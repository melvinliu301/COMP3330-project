import { initializeApp } from "firebase/app";
import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } from "@env"

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
};

const app = initializeApp(firebaseConfig);

export { app };
