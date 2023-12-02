# EventHub

EventHub provides an convenient channel for students to promote and organize event for different faculties or societies in HKU.

This project is created using React Native and Firebase.

# Prerequisite

-   Node.js
-   Emulator or an phone

# Installation

1. Create a `.env.local` file in the root folder. The content of `.env.local` should be as follow:

```
apiKey=<INSERT YOUR FIREBASE APIKEY HERE>
authDomain=<INSERT YOUR FIREBASE AUTHDOMAIN HERE>
projectId=<INSERT YOUR FIREBASE PROJECTID HERE>
storageBucket=<INSERT YOUR FIREBASE STORAGEBUCKET HERE>
messagingSenderId=<INSERT YOUR FIREBASE MESSAGINGSENDERID HERE>
appId=<INSERT YOUR FIREBASE APPID HERE>
```

You can find these information in Firebase Console's Project Settings.

2. Run `npm install`
3. Turn on your emulator or connect your phone with the computer.
4. Run `npm run android` if your device is an android device; run `npm run ios` if your device is an ios device.
5. Enjoy the app!

# Debugging

If you run into the problem where the app cannot be build, try to run `npx expo install --fix` to resolve the problem.
