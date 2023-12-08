import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyAdd0LuBeK2LdQFxdlZ1FOD0MOpUcWmkAs",
  authDomain: "dojolab-edu.firebaseapp.com",
  projectId: "dojolab-edu",
  storageBucket: "dojolab-edu.appspot.com",
  messagingSenderId: "405395805510",
  appId: "1:405395805510:web:bb8c7072ff992e42714147",
  measurementId: "G-YQ6GVQ1ZFQ",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const store = getStorage(app);

// Set the authentication persistence
export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);
