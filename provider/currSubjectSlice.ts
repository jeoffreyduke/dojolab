import { createSlice } from "@reduxjs/toolkit";

export const currSubjectSlice = createSlice({
  name: "subject",
  initialState: {
    value: "",
  },
  reducers: {
    handleCurrSubject: (state, action) => {
      state.value = action.payload;
    },
    refreshCurrSubject: (state) => {
      state.value = "";
    },
  },
});

export const { handleCurrSubject, refreshCurrSubject } =
  currSubjectSlice.actions;

export default currSubjectSlice.reducer;
