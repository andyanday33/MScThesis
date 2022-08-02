import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {db} from '../../firebase/firebaseConfig';
import {collection, getDocs, orderBy, query} from 'firebase/firestore';

const levelCollection = collection(db, 'levelsGenerated');
// TODO: populate db with a script that is not
// going to be shipped to client.

enum directions {
  East = 0,
  South = 1,
  West = 2,
  North = 3,
}

enum moveTypes {
  Forward = 'FORWARD',
  Backwards = 'BACKWARDS',
}

export enum themes {
  Car = 'CAR',
  Cart = 'CART',
  Monkey = 'MONKEY',
  Bear = 'BEAR',
}

export type GridObjectType = {
  objectName?: string,
  coordinateX: number,
  coordinateY: number,
}

export type ActorType = {
  coordinateX: number,
  coordinateY: number,
  direction: directions,
}

// TODO further down the road: add traffic lights.
type LevelType = {
  actors?: ActorType[],
  goals?: GridObjectType[],
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
    crashed: boolean,
    crashedAtTurn: number,
    isLevelingUp: boolean,
    animationInProgress: boolean,
    levels: LevelType[],
    maxLevel: number,
    actors: ActorType[],
    goals: GridObjectType[],
    walls?: GridObjectType[],
    maxUnlockedLevel: number,
    tip?: String,
    turn: number,
    level: number,
    gridSize: number,
    currentMap: CrashableObjectType[][],
    movesThisTry: ActorType[][],
    points: number[],
    theme: themes,
    showingLevelFinishedScreen: boolean,
    showingEndGameScreen: boolean,
};

/* TODO: after adding user auth, change initial
level 0 to where usere left off. */
const initialState: PlaygroundState = {
  // Actors on the map with their x,y coordinates
  status: 'idle',
  crashed: false,
  crashedAtTurn: 0,
  isLevelingUp: false,
  animationInProgress: false,
  levels: [],
  actors: [],
  // Goal coordinates of actors.
  goals: [],
  walls: [],
  maxUnlockedLevel: 0,
  turn: 0,
  level: 0,
  maxLevel: 0,
  gridSize: 0,
  tip: '',
  currentMap: [],
  movesThisTry: [],
  points: [],
  theme: themes.Car,
  showingLevelFinishedScreen: false,
  showingEndGameScreen: false,
};

export const fetchLevels = createAsyncThunk('playground/fetchLevels',
    async () => {
      const response = await getLevels();
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
};

/**
 * Checks whether an actor is crashing
 * depending on the direction and current
 * position. Moves actor one grid forward
 * if there's no crash.
 *
 * @param {PlaygroundState} state current state
 *  of the playground.
 * @param {ActorType} actor actor that is
 *  going to be checked for crashes and moved.
 * @param {moveTypes} moveType Move type indicating
 *  forward or backwards move.
 * @return {ActorType} an actor which is either
 *  moved one grid further or crashed.
 */
const checkCrashedAndMove = (state: PlaygroundState, actor: ActorType,
    moveType: moveTypes) : ActorType => {
  switch (actor.direction) {
    case directions.East:
      switch (moveType) {
        case moveTypes.Forward:
          if (actor.coordinateX === state.gridSize) {
            state.crashed = true;
            state.crashedAtTurn = state.movesThisTry.length + 1;
            return actor;
          }
          actor.coordinateX += 1;
          break;
        case moveTypes.Backwards:
          if (actor.coordinateX === 1) {
            state.crashed = true;
            state.crashedAtTurn = state.movesThisTry.length + 1;
            return actor;
          }
          actor.coordinateX -= 1;
          break;
      }
      break;
    case directions.West:
      // console.log('inside');
      switch (moveType) {
        case moveTypes.Forward:
          if (actor.coordinateX === 1) {
            state.crashed = true;
            state.crashedAtTurn = state.movesThisTry.length + 1;
            return actor;
          }
          actor.coordinateX -= 1;
          break;
        case moveTypes.Backwards:
          if (actor.coordinateX === state.gridSize) {
            state.crashed = true;
            state.crashedAtTurn = state.movesThisTry.length + 1;
            return actor;
          }
          actor.coordinateX += 1;
          break;
      }
      break;
    case directions.North:
      switch (moveType) {
        case moveTypes.Forward:
          if (actor.coordinateY === 1) {
            state.crashed = true;
            state.crashedAtTurn = state.movesThisTry.length + 1;
            return actor;
          }
          actor.coordinateY -= 1;
          break;
        case moveTypes.Backwards:
          if (actor.coordinateY === state.gridSize) {
            state.crashed = true;
            state.crashedAtTurn = state.movesThisTry.length + 1;
            return actor;
          }
          actor.coordinateY += 1;
          break;
      }
      break;
    case directions.South:
      switch (moveType) {
        case moveTypes.Forward:
          if (actor.coordinateY === state.gridSize) {
            state.crashed = true;
            state.crashedAtTurn = state.movesThisTry.length + 1;
            return actor;
          }
          actor.coordinateY += 1;
          break;
        case moveTypes.Backwards:
          if (actor.coordinateY === 1) {
            state.crashed = true;
            state.crashedAtTurn = state.movesThisTry.length + 1;
            return actor;
          }
          actor.coordinateY -= 1;
          break;
      }
      break;
  }
  const mapGrid = state.currentMap[actor.
      coordinateY - 1][actor.coordinateX - 1];
  // check whether the actor has crashed into a wall or another actor.
  // TODO: check this logic for actors again in the future.
  if (mapGrid?.objectName == 'actor' || mapGrid?.objectName == 'wall') {
    state.crashed = true;
    state.crashedAtTurn = state.movesThisTry.length + 1;
  }
  return actor;
};

const setStateValues = (state: PlaygroundState, level = state.level) => {
  state.actors = state.levels[level].actors!;
  state.goals = state.levels[level].goals!;
  state.turn = 0;
  state.gridSize = state.levels[level].gridSize!;
  state.walls = state.levels[level].walls;
  state.tip = state.levels[level].tip;
};

export const playgroundSlice = createSlice({
  name: 'playground',
  initialState,
  reducers: {
    setPoint: (state, action) => {
      state.points[action.payload[0]] = action.payload[1];
    },
    turn: (state, action) => {
      if (!state.crashed) {
        state.turn += 1;
        state.actors = state.actors.map((actor) => {
          if (action.payload === 'LEFT') {
            actor.direction -= 1;
            if (actor.direction < directions.East) {
              actor.direction = directions.North;
            }
          } else if (action.payload === 'RIGHT') {
            actor.direction += 1;
            if (actor.direction > directions.North) {
              actor.direction = directions.East;
            }
          }
          return actor;
        });
        state.movesThisTry.push(state.actors);
      }
    },
    move: (state, action) => {
      if (!state.crashed) {
        state.turn += 1;
        state.actors = state.actors.map((actor) => {
          // Empty actors initial position.
          state.currentMap[actor.coordinateY - 1][actor.coordinateX - 1] =
            {objectName: 'empty'};
          // Check whether the actor has crashed into boundaries.
          return checkCrashedAndMove(state, actor, action.payload);
        });
        state.movesThisTry.push(state.actors);
      }
    },
    levelUp: (state) => {
      if (state.level < state.maxLevel - 1) {
        state.level++;
        setStateValues(state);
        // generate new map
        generateCurrentMap(state);
      }
    },
    restartLevel: (state) => {
      setStateValues(state);
      // generate new map
      generateCurrentMap(state);
    },
    selectLevel: (state, action) => {
      state.showingEndGameScreen = false;
      state.showingLevelFinishedScreen = false;
      if (action.payload >= 0 && action.payload < state.maxLevel) {
        state.level = action.payload;
        setStateValues(state);
        // generate new map
        generateCurrentMap(state);
      }
    },
    startAnimation: (state) => {
      state.animationInProgress = true;
      setStateValues(state);
      // generate new map
      generateCurrentMap(state);
    },
    /**
     * Logically resets the playground and initiates animation progress.
     * @param {PlaygroundState} state State of the playground
     */
    resetTry: (state: PlaygroundState) => {
      state.turn = 0;
      state.crashed = false;
    },
    showOrHideEndLevelScreen: (state: PlaygroundState) => {
      if (state.level !== state.maxLevel - 1) {
        state.showingLevelFinishedScreen = !state.showingLevelFinishedScreen;
      } else {
        state.showingEndGameScreen = true;
      }
    },
    /**
     * Makes the playground available for a new try.
     * @param {PlaygroundState} state State of the playground
     */
    finishThisTry: (state: PlaygroundState) => {
      state.animationInProgress = false;
      state.movesThisTry = [];
      state.actors = state.levels[state.level].actors!;
    },
    changeTheme: (state, action) => {
      state.theme = action.payload;
    },
    startNewGame: (state: PlaygroundState) => {
      state.level = 0;
      setStateValues(state, 0);
      // generate current map
      generateCurrentMap(state);
      state.showingEndGameScreen = false;
    },
    unlockLevel: (state) => {
      if (state.maxUnlockedLevel != state.maxLevel - 1) {
        state.maxUnlockedLevel++;
      }
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchLevels.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchLevels.rejected, (state) => {
          state.status = 'rejected';
        })
        .addCase(fetchLevels.fulfilled, (state, action) => {
          action.payload.forEach((level) => state.levels.push(level));
          state.status = 'idle';
          setStateValues(state, 0);
          state.maxLevel = action.payload.length;
          // generate current map
          generateCurrentMap(state);
          // initialize points array with 100 points on each level
          // that is going to be extracted for each code logic, line of code,
          // etc.
          state.points = new Array(action.payload.length);
          state.points = state.points.fill(100, 0, action.payload.length);
        });
  },
});

export const {move, levelUp, resetTry, finishThisTry,
  startAnimation, turn, changeTheme, selectLevel,
  showOrHideEndLevelScreen, startNewGame,
  restartLevel, unlockLevel, setPoint} = playgroundSlice.actions;

export default playgroundSlice.reducer;
