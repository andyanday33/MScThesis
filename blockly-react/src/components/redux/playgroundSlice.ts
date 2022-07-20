import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {db} from '../../firebase/firebaseConfig';
import {collection, getDocs, orderBy, query} from 'firebase/firestore';
import carSvg from '../../assets/carTheme/car.svg';
import crossSvg from '../../assets/carTheme/cross.svg';
import houseSvg from '../../assets/carTheme/house.svg';
import wallSvg from '../../assets/carTheme/wall.svg';

const levelCollection = collection(db, 'levels');

enum directions {
  North = 0,
  East = 1,
  South = 2,
  West = 3,
}

enum moveTypes {
  Forward = 'FORWARD',
  Backwards = 'BACKWARDS',
}

export type GridObjectType = {
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
    crashed: boolean,
    crashedAtTurn: number,
    isLevelingUp: boolean,
    animationInProgress: boolean,
    levels: LevelType[],
    maxLevel: number,
    actors: ActorType[],
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
    movesThisTry: GridObjectType[][],
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
  movesThisTry: [],
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
  if (state.houses) {
    for (let i = 0; i < state.houses.length; i++) {
      state.currentMap[state.houses[i].coordinateY - 1][state.houses[i].
          coordinateX - 1] = {objectName: 'house'};
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

export const playgroundSlice = createSlice({
  name: 'playground',
  initialState,
  reducers: {
    turn: (state, action) => {
      state.actors = state.actors.map((actor) => {
        if (action.payload === 'LEFT') {
          actor.direction -= 1;
          if (actor.direction < directions.North) {
            actor.direction = directions.East;
          }
        } else if (action.payload === 'RIGHT') {
          actor.direction += 1;
          if (actor.direction > directions.East) {
            actor.direction = directions.North;
          }
        }
        console.log(actor);
        return actor;
      });
      state.movesThisTry.push(state.actors);
    },
    move: (state, action) => {
      if (!state.crashed) {
        console.log(action);
        state.turn = state.turn += 1;
        state.actors = state.actors.map((actor) => {
          // Check whether the actor has crashed into boundaries.
          // TODO: this would require some additional checking
          // after introducing turning block.
          return checkCrashedAndMove(state, actor, action.payload);
        });
        state.movesThisTry.push(state.actors);
      }
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
    startAnimation: (state) => {
      state.animationInProgress = true;
    },
    /**
     * Logically resets the playground and initiates animation progress.
     * @param {PlaygroundState} state State of the playground
     */
    resetTry: (state: PlaygroundState) => {
      state.turn = 0;
      state.crashed = false;
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

export const {move, levelUp, resetTry, finishThisTry,
  startAnimation, turn} = playgroundSlice.actions;

export default playgroundSlice.reducer;
