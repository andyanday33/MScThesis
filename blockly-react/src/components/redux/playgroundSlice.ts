import {createSlice} from '@reduxjs/toolkit';

/* TODO: add goal points for the game and reset positions to initial
if goal is not met */
interface PlaygroundState {
    actors: number[][]
}

const initialState: PlaygroundState = {
  // Actors on the map with their x,y coordinates
  actors: [[50, 50], [50, 150], [50, 250]],
};

export const playgroundSlice = createSlice({
  name: 'actors',
  initialState,
  reducers: {
    move: (state) => {
      state.actors = state.actors.map((actor) => {
        actor[0] += 50;
        return actor;
      });
    },
  },
});

export const {move} = playgroundSlice.actions;

export default playgroundSlice.reducer;
