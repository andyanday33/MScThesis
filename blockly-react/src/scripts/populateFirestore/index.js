import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {doc, setDoc} from 'firebase/firestore';
import {readFile} from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
  experimentalForceLongPolling: true,
  useFetchStreams: false,
};

console.log(firebaseConfig.apiKey);
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const json = await JSON.parse(
    await readFile(
        new URL('./levels.json', import.meta.url),
    ),
);

for (const level of json.levels) {
  console.log(level.levelNo);
  await setDoc(doc(db, 'levelsGenerated', `${level.levelNo}`), level);
}

process.abort();
