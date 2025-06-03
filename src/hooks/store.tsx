import { configureStore } from '@reduxjs/toolkit';
import { pipelineSlice } from "./pipelineSlice.tsx";

export const store = configureStore({
    reducer: {
        pipeline: pipelineSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;