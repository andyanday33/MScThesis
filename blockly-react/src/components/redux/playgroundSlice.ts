import {createSlice} from '@reduxjs/toolkit';

/* TODO: Fetch level data from the backend
TODO: Add more than one levels */
interface PlaygroundState {
    actors: number[][],
    goals: number[][],
    turn: number,
}

const initialState: PlaygroundState = {
  // Actors on the map with their x,y coordinates
  actors: [[1, 1], [1, 3], [1, 5]],
  goals: [[4, 1], [4, 3], [4, 5]],
  turn: 0,
};

export const playgroundSlice = createSlice({
  name: 'actors',
  initialState,
  reducers: {
    move: (state) => {
      state.turn = state.turn += 1;
      state.actors = state.actors.map((actor) => {
        actor[0] += 1;
        return actor;
      });
    },
    reset: () => initialState,
  },
});

export const {move, reset} = playgroundSlice.actions;

export default playgroundSlice.reducer;
