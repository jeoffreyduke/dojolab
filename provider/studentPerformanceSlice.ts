import { createSlice } from "@reduxjs/toolkit";

export const studentPerformanceSlice = createSlice({
  name: "studentPerformance",
  initialState: {
    value: [],
  },
  reducers: {
    handleStudentPerformance: (state, action) => {
      state.value = action.payload;
    },
    refreshStudentPerformance: (state) => {
      state.value = [];
    },
  },
});

export const { handleStudentPerformance, refreshStudentPerformance } =
  studentPerformanceSlice.actions;

export default studentPerformanceSlice.reducer;
