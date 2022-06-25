import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlaygroundState {
    actorPosition: number[]
}

const initialState: PlaygroundState = {
    actorPosition: [50, 50]
}

export const playgroundSlice = createSlice({
    name: "code",
    initialState,
    reducers: {
        moveForward: (state) => {
            state.actorPosition[0] += 50;
        },
    }
});

export const { moveForward } = playgroundSlice.actions;