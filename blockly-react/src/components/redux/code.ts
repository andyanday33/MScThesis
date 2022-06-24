import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CodeState {
    code: string
}

const initialState: CodeState = {
    code: ""
}

export const codeSlice = createSlice({
    name: "code",
    initialState,
    reducers: {
        generate: (state, code: PayloadAction<string>) => {
            state.code = code.payload;
        },
        generateAndEval: (state, code: PayloadAction<string>) => {
            state.code = code.payload;
            eval(state.code);
        }
    }
});