import { configureStore } from "@reduxjs/toolkit";
import taskRefresherReducer from "./features/taskRefresherSlice";

export const store = configureStore({
    reducer: {
        taskRefresher: taskRefresherReducer,
    }
});
