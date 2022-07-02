import {createSlice} from '@reduxjs/toolkit';
import {db} from '../../firebase/firebaseConfig';
import {collection, getDocs} from 'firebase/firestore';

const levelCollection = collection(db, 'levels');

type GridType = {
  coordinateX: number,
  coordinateY: number,
}

type LevelsType = {
  actors?: GridType[],
  goals?: GridType[],
  gridSize?: number,
  id: string,
  levelNo?: number,
}

// TODO: add order by levelNo inside firebase collection
const getLevels: () => Promise<LevelsType[]> = async () => {
  let levels: LevelsType[] = [];
  await getDocs(levelCollection).then((data) => {
    levels = data.docs.map((doc) => {
      const temp = {...doc.data(), id: doc.id};
      return temp;
    });
  });
  return levels;
};

const levels: LevelsType[] = await getLevels();

/* TODO: Fetch level data from the backend
TODO: Add more than one levels */
interface PlaygroundState {
    maxLevel: number,
    actors: GridType[],
    goals: GridType[],
    turn: number,
    level: number,
};

// TODO: Add other objects in the map.
/* TODO: after adding user auth, change initial
level 0 to where usere left off. */
const initialState: PlaygroundState = {
  // Actors on the map with their x,y coordinates
  actors: levels[0].actors!,
  // Goal coordinates of actors.
  goals: levels[0].goals!,
  turn: 0,
  level: 0,
  maxLevel: 1,
};

export const playgroundSlice = createSlice({
  name: 'playground',
  initialState,
  reducers: {
    move: (state) => {
      state.turn = state.turn += 1;
      state.actors = state.actors.map((actor) => {
        actor.coordinateX += 1;
        return actor;
      });
    },
    levelUp: (state) => {
      if (state.level < state.maxLevel) {
        state.level++;
        state.actors = levels[state.level].actors!;
        state.goals = levels[state.level].goals!;
        state.turn = 0;
      }
    },
    reset: (state) => {
      state.actors = levels[state.level].actors!;
      state.turn = 0;
    },
  },
});

export const {move, levelUp, reset} = playgroundSlice.actions;

export default playgroundSlice.reducer;
