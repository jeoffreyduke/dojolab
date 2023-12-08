import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import userSlice from "./userSlice";
import allUsersSlice from "./allUsersSlice";
import themeSlice from "./themeSlice";
import pushNotificationSlice from "./pushNotificationSlice";
import currClassroomSlice from "./currClassroomSlice";
import currProfileSlice from "./currProfileSlice";
import currSubjectSlice from "./currSubjectSlice";
import studentAttendanceSlice from "./studentAttendanceSlice";
import studentPerformanceSlice from "./studentPerformanceSlice";
import attendanceUpdatedSlice from "./classroomUpdatedSlice";
import studentsUpdatedSlice from "./studentsUpdatedSlice";
import classroomUpdatedSlice from "./classroomUpdatedSlice";

const rootReducer = combineReducers({
  user: userSlice,
  users: allUsersSlice,
  theme: themeSlice,
  pushNotification: pushNotificationSlice,
  classroom: currClassroomSlice,
  profile: currProfileSlice,
  subject: currSubjectSlice,
  studentAttendance: studentAttendanceSlice,
  studentPerformance: studentPerformanceSlice,
  studentsUpdated: studentsUpdatedSlice,
  classroomUpdated: classroomUpdatedSlice,
});

const persistedReducer = persistReducer(
  {
    key: "root",
    storage: AsyncStorage,
    version: 0,
    whitelist: [
      "user",
      "theme",
      "pushNotification",
      "classroom",
      "profile",
      "subject",
      "studentAttendance",
      "studentPerformance",
      "studentsUpdated",
      "classroomUpdated",
    ],
  },
  rootReducer
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
export default store;
