import { configureStore } from '@reduxjs/toolkit';
import codeReducer from './codeSlice';
import playgroundReducer from './playgroundSlice';

//TODO: connect the store to slices and blockly/canvas components to the store.
export const store = configureStore({
    reducer: {
        code: codeReducer,
        playground: playgroundReducer,
    }
}); 

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch