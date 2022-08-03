/* eslint-disable @typescript-eslint/no-unused-vars */
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {doc, setDoc} from 'firebase/firestore';
import {readFile} from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

const DIRECTION_EAST = 0;
const DIRECTION_SOUTH = 1;
const DIRECTION_WEST = 2;
const DIRECTION_NORTH = 3;

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

// Levels 1-4
for (const level of json.levels) {
  await setDoc(doc(db, 'levelsGenerated', `${level.levelNo}`), level);
}

// Level 5
let level = {
  gridSize: 10,
  levelNo: 5,
  actors: [
    {
      coordinateX: 1,
      coordinateY: 2,
      direction: DIRECTION_EAST,
    },
  ],
  goals: [
    {
      coordinateX: 10,
      coordinateY: 2,
    },
  ],
  walls: [],
  tip: 'Introducing: loops! Loops are used to ' +
  'run a piece of code multiple times.\n' +
  'A loop will start counting from a number up to another one,' +
  ' (including both) by a customizable amount ' +
  'and would run the code piece attached to it for each count.',
};
for (let i = 1; i <= level.gridSize; i++) {
  if (i == 2) {
    continue;
  } else {
    for (let j = 1; j <= level.gridSize; j++) {
      level.walls.push({
        coordinateX: j,
        coordinateY: i,
      });
    }
  }
}

await setDoc(doc(db, 'levelsGenerated', `${level.levelNo}`), level);

// Level 6
level = {
  gridSize: 10,
  levelNo: 6,
  actors: [
    {
      coordinateX: 10,
      coordinateY: 10,
      direction: DIRECTION_SOUTH,
    },
  ],
  goals: [
    {
      coordinateX: 1,
      coordinateY: 1,
    },
  ],
  walls: [],
  tip: 'Now try mixing loops with turning around and movement!',
};
for (let i = 1; i <= level.gridSize; i++) {
  for (let j = 1; j <= level.gridSize; j++) {
    console.log(Math.abs(i - j));
    if (!(Math.abs(i - j) <= 1)) {
      level.walls.push({
        coordinateX: j,
        coordinateY: i,
      });
    }
  }
}

await setDoc(doc(db, 'levelsGenerated', `${level.levelNo}`), level);

// Level 7
level = {
  gridSize: 10,
  levelNo: 0,
  actors: [
    {
      coordinateX: 1,
      coordinateY: 10,
      direction: DIRECTION_SOUTH,
    },
  ],
  goals: [
    {
      coordinateX: 1,
      coordinateY: 1,
    },
  ],
  walls: [],
  tip: 'more zig-zags!',
};
for (let i = 1; i <= level.gridSize / 2; i++) {
  for (let j = 1; j <= level.gridSize / 2; j++) {
    console.log(Math.abs(i - j));
    if (i - j < 0 || i - j > 1) {
      level.walls.push({
        coordinateX: j,
        coordinateY: i,
      });
    }
  }
}
for (let i = level.gridSize; i > level.gridSize / 2; i--) {
  for (let j = 1; j <= level.gridSize / 2; j++) {
    if (i + j - level.gridSize < 0 || i + j - level.gridSize > 1) {
      level.walls.push({
        coordinateX: j,
        coordinateY: i,
      });
    }
  }
}
for (let i = 1; i <= level.gridSize; i++) {
  for (let j = 6; j <= level.gridSize; j++) {
    level.walls.push({
      coordinateX: j,
      coordinateY: i,
    });
  }
}

await setDoc(doc(db, 'levelsGenerated', `${level.levelNo}`), level);

// Level 8
level = {
  gridSize: 10,
  levelNo: 8,
  actors: [
    {
      coordinateX: 1,
      coordinateY: 10,
      direction: DIRECTION_SOUTH,
    },
  ],
  goals: [
    {
      coordinateX: 10,
      coordinateY: 5,
    },
  ],
  walls: [],
  tip: 'This is where the fun begins.',
};
for (let i = 1; i <= level.gridSize / 2; i++) {
  for (let j = 1; j <= level.gridSize / 2; j++) {
    console.log(Math.abs(i - j));
    if (!(Math.abs(i - j) <= 1)) {
      level.walls.push({
        coordinateX: j,
        coordinateY: i,
      });
      level.walls.push({
        coordinateX: level.gridSize - j,
        coordinateY: level.gridSize - i,
      });
    }
  }
}

await setDoc(doc(db, 'levelsGenerated', `${level.levelNo}`), level);

process.abort();
