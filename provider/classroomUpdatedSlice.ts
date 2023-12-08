import { createSlice } from "@reduxjs/toolkit";

export const classroomUpdatedSlice = createSlice({
  name: "classroomUpdated",
  initialState: {
    value: Date.now(),
  },
  reducers: {
    handleClassroomUpdated: (state, action) => {
      state.value = action.payload;
    },
    refreshClassroomUpdated: (state) => {
      state.value = Date.now();
    },
  },
});

export const { handleClassroomUpdated, refreshClassroomUpdated } =
  classroomUpdatedSlice.actions;

export default classroomUpdatedSlice.reducer;
