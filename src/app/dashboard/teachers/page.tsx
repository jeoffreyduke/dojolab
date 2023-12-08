"use client";
import React, { useState } from "react";
import styles from "./Teachers.module.css";
import Header from "../../components/Header/Header";
import StudentBD from "@/app/components/Backdrops/StudentBackDrop/StudentBD";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../../firebaseConfig";
import { collection, doc, orderBy, query } from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";

function Teachers() {
  const [openStudentBD, setOpenStudentBD] = useState(false);

  const [User] = useAuthState(auth);
  const userRef = User && doc(db, "users", User.uid);
  const [user] = useDocumentData(userRef);

  const studentsRef =
    user && collection(db, "schools", user.schoolId, "students");

  const studentsQuery = studentsRef && query(studentsRef, orderBy("name"));

  const [students] = useCollectionData(studentsQuery);

  return (
    <div className={styles.main}>
      <Header placeholderPart="teachers" />
      <header className={styles.header}>
        <div className={styles.headerItems}>
          <p className={styles.headerText}>Teachers</p>
          <button
            className={styles.headerBtn}
            onClick={() => setOpenStudentBD(!openStudentBD)}
          >
            Add new teacher
          </button>
        </div>
      </header>
      <section className={styles.boxes}>
        <div className={styles.box}></div>
        <div className={styles.box}></div>
        <div className={styles.box}></div>
        <div className={styles.box}></div>
      </section>

      <StudentBD
        open={openStudentBD}
        setOpen={setOpenStudentBD}
        user={user}
        id={""}
      />
    </div>
  );
}

export default Teachers;
