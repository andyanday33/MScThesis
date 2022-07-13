import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {db} from '../../firebase/firebaseConfig';
import {collection, getDocs, orderBy, query} from 'firebase/firestore';
import carSvg from '../../../public/car.svg';
import crossSvg from '../../../public/cross.svg';
import houseSvg from '../../../public/house.svg';
import wallSvg from '../../../public/wall.svg';

const levelCollection = collection(db, 'levels');

type GridObjectType = {
  coordinateX: number,
  coordinateY: number,
}

// TODO: add house and wall coordinates to firestore
// anything else could be considered a road.
// further down the road: add traffic lights.
// adding level tips could be nice probably.
type LevelType = {
  actors?: GridObjectType[],
  goals?: GridObjectType[],
  houses?: GridObjectType[],
  walls?: GridObjectType[],
  gridSize?: number,
  tip?: string,
  id: string,
  levelNo?: number,
}


// TODO: add level selection logic
const getLevels: () => Promise<LevelType[]> = async () => {
  let levels: LevelType[] = [];
  await getDocs(query(levelCollection, orderBy('levelNo')))
      .then((data) => {
        levels = data.docs.map((doc) => {
          const temp = {...doc.data(), id: doc.id};
          return temp;
        });
      });
  return levels;
};

type CrashableObjectType = {
  objectName: String,
}
interface PlaygroundState {
    status: String,
    levels: LevelType[],
    maxLevel: number,
    actors: GridObjectType[],
    goals: GridObjectType[],
    walls?: GridObjectType[],
    houses?: GridObjectType[],
    tip?: String,
    turn: number,
    level: number,
    gridSize: number,
    currentMap: CrashableObjectType[][],
    actorImageSrc: string,
    houseImageSrc: string,
    wallImageSrc: string,
    goalImageSrc: string
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
  currentMap: [],
  actorImageSrc: carSvg,
  houseImageSrc: houseSvg,
  goalImageSrc: crossSvg,
  wallImageSrc: wallSvg,
};

export const fetchLevels = createAsyncThunk('playground/fetchLevels',
    async () => {
      const response = await getLevels();
      console.log(response);
      return response;
    },
);

const generateCurrentMap = (state: PlaygroundState) => {
  state.currentMap = [...Array(state.gridSize)].
      map(() => new Array(state.gridSize));
  for (let i = 0; i < state.actors.length; i++) {
    state.currentMap[state.actors[i].coordinateY - 1][state.actors[i].
        coordinateX - 1] = {objectName: 'actor'};
  }
  for (let i = 0; i < state.goals.length; i++) {
    state.currentMap[state.goals[i].coordinateY - 1][state.goals[i].
        coordinateX - 1] = {objectName: 'goal'};
  }
  if (state.walls) {
    for (let i = 0; i < state.walls.length; i++) {
      state.currentMap[state.walls[i].coordinateY - 1][state.walls[i].
          coordinateX - 1] = {objectName: 'wall'};
    }
  }
  if (state.houses) {
    for (let i = 0; i < state.houses.length; i++) {
      state.currentMap[state.houses[i].coordinateY - 1][state.houses[i].
          coordinateX - 1] = {objectName: 'house'};
    }
  }
};

export const playgroundSlice = createSlice({
  name: 'playground',
  initialState,
  reducers: {
    move: (state) => {
      state.turn = state.turn += 1;
      state.actors = state.actors.map((actor) => {
        actor.coordinateX += 1;
        // Check if it hits the wall
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
        // generate new map
        generateCurrentMap(state);
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
          // generate current map
          generateCurrentMap(state);
        });
  },
});

export const {move, levelUp, reset} = playgroundSlice.actions;

export default playgroundSlice.reducer;
