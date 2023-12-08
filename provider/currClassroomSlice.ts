import { createSlice } from "@reduxjs/toolkit";

export const currClassroomSlice = createSlice({
  name: "classroom",
  initialState: {
    value: "",
  },
  reducers: {
    handleCurrClassroom: (state, action) => {
      state.value = action.payload;
    },
    refreshCurrClassroom: (state) => {
      state.value = "";
    },
  },
});

export const { handleCurrClassroom, refreshCurrClassroom } =
  currClassroomSlice.actions;

export default currClassroomSlice.reducer;
