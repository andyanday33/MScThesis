import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { moveForward } from './playgroundSlice';

interface CodeState {
    value: string
}

const initialState: CodeState = {
    value: ""
}

export const codeSlice = createSlice({
    name: "code",
    initialState,
    reducers: {
        generate: (state, code: PayloadAction<string>) => {
            state.value = code.payload;
        },
        generateAndEval: (state, code: PayloadAction<string>) => {
            state.value = code.payload;
            eval(state.value);
        }
    }
});

export const { generate, generateAndEval } = codeSlice.actions;

export default codeSlice.reducer;