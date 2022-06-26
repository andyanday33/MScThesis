import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlaygroundState {
    actors: number[][]
}

const initialState: PlaygroundState = {
    //Actors on the map with their x,y coordinates
    actors : [[50, 50], [50, 150], [50, 250]],
}

export const playgroundSlice = createSlice({
    name: "actors",
    initialState,
    reducers: {
        move: (state) => {
            state.actors = state.actors.map((actor) => {
                actor[0] += 50;
                return actor;
            });
        },
    }
});

export const { move } = playgroundSlice.actions;

export default playgroundSlice.reducer;