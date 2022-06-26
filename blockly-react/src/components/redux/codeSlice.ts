import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
        }
    }
});

export const { generate } = codeSlice.actions;

export default codeSlice.reducer;