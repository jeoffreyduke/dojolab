import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    value: true,
  },
  reducers: {
    handleSwitchTheme: (state) => {
      state.value = !state.value;
    },
  },
});

export const { handleSwitchTheme } = themeSlice.actions;

export default themeSlice.reducer;
