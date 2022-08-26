# Puzzlaffic, a coding puzzle game written in Typescript React with Redux and Blockly with Vite.js tooling.

To run the application, you need to first initialize a firebase firestore instance and add corresponding fields in a .env file inside blockly-react directory 
with an all uppercase, separated by "\_" format with "VITE\_" prefix. For example: VITE\_API\_KEY=*******

Fields inside the .env file are going to be used for firebase firestore connection inside src/firebase/firebaseConfig.ts

***fields imported inside src/firebase/firebaseConfig.ts***
```
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
```

After creating a firestore instance and connecting to it, you could populate the instance by running the
node.js script src/scripts/populateFirestore/index.js

For the script to be able to populate the same firestore instance, you would simply need to create a new .env file inside populateFirestore directory, 
with the same regex rule as above without the "VITE\_" prefix.

***fields imported inside src/scripts/populateFirestore/index.js***
```
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
```

After creating .env files and populating the firestore, you could run the application using

`npm run dev`

You could create a production build using

`npm run build`

and preview the production build using

`npm run preview`

## Introducing new levels

You could add new levels to the game by simply adding a new level document to populateFirestore script.
