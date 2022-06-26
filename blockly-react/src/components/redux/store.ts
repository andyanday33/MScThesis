import { configureStore } from '@reduxjs/toolkit';
import playgroundReducer from './playgroundSlice';

export const store = configureStore({
    reducer: {
        playground: playgroundReducer,
    }
}); 

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch