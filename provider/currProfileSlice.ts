import { createSlice } from "@reduxjs/toolkit";

export const currProfileSlice = createSlice({
  name: "profile",
  initialState: {
    value: "",
  },
  reducers: {
    handleCurrProfile: (state, action) => {
      state.value = action.payload;
    },
    refreshCurrProfile: (state) => {
      state.value = "";
    },
  },
});

export const { handleCurrProfile, refreshCurrProfile } =
  currProfileSlice.actions;

export default currProfileSlice.reducer;
