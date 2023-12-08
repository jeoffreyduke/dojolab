import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import store from "../provider/store";

export async function fetchClassrooms() {
  const classrooms: any = [];

  const uid = store.getState().user.value;

  const userRef = doc(db, "users", uid);
  const userData = await getDoc(userRef);

  if (userData.exists()) {
    const classroomsRef = collection(
      db,
      "schools",
      userData.data().schoolId,
      "classrooms"
    );

    const classroomsSnap = await getDocs(classroomsRef);

    return classroomsSnap.docs.map((classroom) => ({
      classroom: classroom.id,
    }));
  }

  return classrooms;
}
