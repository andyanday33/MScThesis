import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
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

// TODO: use RTK Query here instead
// const levels: LevelsType[] = await getLevels();
interface PlaygroundState {
    status: String,
    levels: LevelsType[],
    maxLevel: number,
    actors: GridType[],
    goals: GridType[],
    walls?: GridType[],
    houses?: GridType[],
    tip?: String,
    turn: number,
    level: number,
    gridSize: number,
};

// TODO: Add other objects in the map.
/* TODO: after adding user auth, change initial
level 0 to where usere left off. */
const initialState: PlaygroundState = {
  // Actors on the map with their x,y coordinates
  status: 'idle',
  levels: [],
  actors: [],
  // Goal coordinates of actors.
  goals: [],
  walls: [],
  houses: [],
  turn: 0,
  level: 0,
  maxLevel: 0,
  gridSize: 0,
  tip: '',
};

export const fetchLevels = createAsyncThunk('playground/fetchLevels',
    async () => {
      const response = await getLevels();
      console.log(response);
      return response;
    },
);

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
        state.actors = state.levels[state.level].actors!;
        state.goals = state.levels[state.level].goals!;
        state.turn = 0;
        state.gridSize = state.levels[state.level].gridSize!;
        state.houses = state.levels[state.level].houses;
        state.walls = state.levels[state.level].walls;
        state.tip = state.levels[state.level].tip;
      }
    },
    reset: (state) => {
      state.actors = state.levels[state.level].actors!;
      state.turn = 0;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchLevels.pending, (state, action) => {
          state.status = 'loading';
        })
        .addCase(fetchLevels.rejected, (state, action) => {
          state.status = 'rejected';
        })
        .addCase(fetchLevels.fulfilled, (state, action) => {
          action.payload.forEach((level) => state.levels.push(level));
          state.status = 'idle';
          state.actors = state.levels[0].actors!;
          // Goal coordinates of actors.
          state.goals = state.levels[0].goals!;
          state.walls = state.levels[0].walls;
          state.houses = state.levels[0].houses;
          state.turn = 0;
          state.level = 0;
          state.maxLevel = state.levels.length;
          state.gridSize = state.levels[0].gridSize!;
          state.tip = state.levels[0].tip;
        });
  },
});

export const {move, levelUp, reset} = playgroundSlice.actions;

export default playgroundSlice.reducer;
