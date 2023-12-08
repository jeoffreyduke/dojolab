import { createSlice } from "@reduxjs/toolkit";

export const studentsUpdatedSlice = createSlice({
  name: "studentsUpdated",
  initialState: {
    value: Date.now(),
  },
  reducers: {
    handleStudentsUpdated: (state, action) => {
      state.value = action.payload;
    },
    refreshStudentsUpdated: (state) => {
      state.value = Date.now();
    },
  },
});

export const { handleStudentsUpdated, refreshStudentsUpdated } =
  studentsUpdatedSlice.actions;

export default studentsUpdatedSlice.reducer;
