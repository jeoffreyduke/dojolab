import { createSlice } from "@reduxjs/toolkit";

export const studentAttendanceSlice = createSlice({
  name: "studentAttendance",
  initialState: {
    value: [],
  },
  reducers: {
    handleStudentAttendance: (state, action) => {
      state.value = action.payload;
    },
    refreshStudentAttendance: (state) => {
      state.value = [];
    },
  },
});

export const { handleStudentAttendance, refreshStudentAttendance } =
  studentAttendanceSlice.actions;

export default studentAttendanceSlice.reducer;
