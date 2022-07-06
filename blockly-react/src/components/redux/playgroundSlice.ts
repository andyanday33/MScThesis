import {createSlice} from '@reduxjs/toolkit';
import {db} from '../../firebase/firebaseConfig';
import {collection, getDocs, orderBy, query} from 'firebase/firestore';

const levelCollection = collection(db, 'levels');

type GridType = {
  coordinateX: number,
  coordinateY: number,
}

// TODO: add house and wall coordinates to firestore
// anything else could be considered a road.
// further down the road: add traffic lights.
// adding level tips could be nice probably.
type LevelsType = {
  actors?: GridType[],
  goals?: GridType[],
  houses?: GridType[],
  walls?: GridType[],
  gridSize?: number,
  tip?: string,
  id: string,
  levelNo?: number,
}

// TODO: add order by levelNo inside firebase collection
// TODO: add roads and walls
// TODO: add level selection logic
const getLevels: () => Promise<LevelsType[]> = async () => {
  let levels: LevelsType[] = [];
  await getDocs(query(levelCollection, orderBy('levelNo')))
      .then((data) => {
        levels = data.docs.map((doc) => {
          const temp = {...doc.data(), id: doc.id};
          return temp;
        });
      });
  return levels;
};

const levels: LevelsType[] = await getLevels();

interface PlaygroundState {
    maxLevel: number,
    actors: GridType[],
    goals: GridType[],
    walls?: GridType[],
    houses?: GridType[],
    turn: number,
    level: number,
    gridSize: number,
};

// TODO: Add other objects in the map.
/* TODO: after adding user auth, change initial
level 0 to where usere left off. */
const initialState: PlaygroundState = {
  // Actors on the map with their x,y coordinates
  actors: levels[0].actors!,
  // Goal coordinates of actors.
  goals: levels[0].goals!,
  walls: levels[0].walls,
  houses: levels[0].houses,
  turn: 0,
  level: 0,
  maxLevel: levels.length,
  gridSize: levels[0].gridSize!,
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
        state.gridSize = levels[state.level].gridSize!;
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
