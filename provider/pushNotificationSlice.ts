import { createSlice } from "@reduxjs/toolkit";

export const pushNotificationSlice = createSlice({
  name: "pushNotification",
  initialState: {
    value: true,
  },
  reducers: {
    handleSwitchNotification: (state) => {
      state.value = !state.value;
    },
  },
});

export const { handleSwitchNotification } = pushNotificationSlice.actions;

export default pushNotificationSlice.reducer;
