import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlaygroundState {
    actorPosition: number[]
}

const initialState: PlaygroundState = {
    actorPosition: [50, 50]
}

export const playgroundSlice = createSlice({
    name: "actor",
    initialState,
    reducers: {
        move: (state) => {
            state.actorPosition[0] += 50;
        },
    }
});

export const { move } = playgroundSlice.actions;

export default playgroundSlice.reducer;