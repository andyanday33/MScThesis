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

console.log(levels);

/* TODO: Fetch level data from the backend
TODO: Add more than one levels */
interface PlaygroundState {
    actors: GridType[],
    goals: GridType[],
    turn: number,
}

const initialState: PlaygroundState = {
  // Actors on the map with their x,y coordinates
  actors: levels[0].actors!,
  goals: levels[0].goals!,
  turn: 0,
};

export const playgroundSlice = createSlice({
  name: 'actors',
  initialState,
  reducers: {
    move: (state) => {
      state.turn = state.turn += 1;
      state.actors = state.actors.map((actor) => {
        actor.coordinateX += 1;
        return actor;
      });
    },
    reset: () => initialState,
  },
});

export const {move, reset} = playgroundSlice.actions;

export default playgroundSlice.reducer;
