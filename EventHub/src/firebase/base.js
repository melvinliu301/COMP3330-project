import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./credentials";

// example format of firebaseConfig:
// const firebaseConfig = {
//     apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//     authDomain: "xxx.firebaseapp.com",
//     projectId: "xxx",
//     storageBucket: "xxxx.appspot.com",
//     messagingSenderId: "xxxxxxxxxxxx",
//     appId: "x:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxx",
// };

const app = initializeApp(firebaseConfig);

export { app };
