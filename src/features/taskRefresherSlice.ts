import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: true
};

const taskRefresherSlice = createSlice({
    name: "taskRefresher",
    initialState,
    reducers: {
        set(state, action) {
            state.value = action.payload
        }
    }
});

// Action creators are generated for each case reducer function
export const { set } = taskRefresherSlice.actions;

export default taskRefresherSlice.reducer;