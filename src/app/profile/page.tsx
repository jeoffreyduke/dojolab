"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { handleCurrProfile } from "../../../provider/currProfileSlice";
import Header from "../components/Header/Header";
import styles from "./Profile.module.css";
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebaseConfig";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Attendance from "./components/Attendance/Attendance";
import GradeBD from "../components/Backdrops/GradeBackDrop/GradeBD";
import Grades from "./components/Grades";

function Profile() {
  const selector = useSelector(handleCurrProfile);
  const id = selector.payload.profile.value;

  const [User] = useAuthState(auth);
  const userRef = User && doc(db, "users", User.uid);
  const [user] = useDocumentData(userRef);

  const studentRef = user && doc(db, "schools", user.schoolId, "students", id);
  const [student] = useDocumentData(studentRef);

  const attendanceRef =
    user &&
    collection(db, "schools", user.schoolId, "students", id, "attendance");

  const [attendance] = useCollectionData(attendanceRef);

  const subjectsRef =
    user &&
    student &&
    collection(
      db,
      "schools",
      user.schoolId,
      "classrooms",
      student.classroomId,
      "subjectIds"
    );

  const subjectsQuery = subjectsRef && query(subjectsRef, orderBy("name"));

  const [subjects] = useCollectionData(subjectsQuery);

  const gradesRef =
    user &&
    student &&
    collection(db, "schools", user.schoolId, "students", student.id, "grades");

  const gradesQuery = gradesRef && query(gradesRef, orderBy("name"));

  const [grades] = useCollectionData(gradesQuery);

  const assessmentsRef =
    user &&
    student &&
    collection(
      db,
      "schools",
      user.schoolId,
      "classrooms",
      student.classroomId,
      "assessments"
    );

  const assessmentsQuery =
    assessmentsRef && query(assessmentsRef, orderBy("createdAt"));

  const [assessments] = useCollectionData(assessmentsQuery);

  const getAssessment = async (assessmentId: string, subjectId: string) => {
    const assessmentRef =
      user &&
      student &&
      doc(
        db,
        "schools",
        user.schoolId,
        "classrooms",
        student.classroomId,
        "assessments",
        assessmentId,
        subjectId,
        student.id
      );

    const assessment = assessmentRef && (await getDoc(assessmentRef));

    return assessment?.data();
  };

  const classroomsRef =
    user &&
    student &&
    doc(db, "schools", user.schoolId, "classrooms", student.classroomId);

  const [classroom] = useDocumentData(classroomsRef);

  return (
    <div className={styles.main}>
      <Header placeholderPart="student" />

      {user && student && attendance && subjects && (
        <>
          <header className={styles.header}>
            <div className={styles.headerItems}>
              <p className={styles.headerText}>{student.name}</p>
            </div>
          </header>

          <section className={styles.studentsCon}>
            <p className={styles.title}>Attendance</p>
            <div className={styles.calendar}>
              <Attendance
                user={user}
                student={student}
                attendance={attendance}
              />
            </div>
          </section>

          <section className={styles.studentsCon}>
            <p className={styles.title}>Grades</p>
            <div className={styles.gradesCon}>
              <Grades
                grades={grades}
                subjects={subjects}
                assessments={assessments}
                getAssessment={getAssessment}
                user={user}
                classroom={classroom}
                student={student}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Profile;
