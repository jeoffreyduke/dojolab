"use client";
import React, { useEffect, useState } from "react";
import styles from "./Subjects.module.css";
import Header from "@/app/components/Header/Header";
import { handleCurrSubject } from "../../../provider/currSubjectSlice";
import { useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebaseConfig";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import AssignSubjectBd from "../components/Backdrops/SubjectBackDrop/AssignSubjectBd";
import {
  calculateOverallPerformanceForSubject,
  countStudentsTakingSubject,
} from "../../../api/stats";
import { CircularProgress } from "@mui/material";

function Subjects() {
  const [openSubjectBD, setOpenSubjectBD] = useState(false);
  const [performance, setPerformance] = useState(0);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalStudentsLoading, setTotalStudentsLoading] = useState(false);

  const selector = useSelector(handleCurrSubject);
  const id = selector.payload.subject.value;

  const [User] = useAuthState(auth);
  const userRef = User && doc(db, "users", User.uid);
  const [user] = useDocumentData(userRef);

  const subjectRef = user && doc(db, "schools", user.schoolId, "subjects", id);
  const [subject] = useDocumentData(subjectRef);

  useEffect(() => {
    setPerformanceLoading(true);
    if (user) {
      const fetchPerformance = async () => {
        const performanceData = await calculateOverallPerformanceForSubject(
          user,
          id
        );
        console.log(performanceData, "performance");
        setPerformance(performanceData);
      };
      fetchPerformance();
      setPerformanceLoading(false);
    }
  }, [user, id]);

  useEffect(() => {
    setTotalStudentsLoading(true);
    if (user) {
      const fetchTotalStudents = async () => {
        const totalStudents = await countStudentsTakingSubject(user, id);
        console.log(totalStudents, "total students");
        setTotalStudents(totalStudents);
      };
      fetchTotalStudents();
      setTotalStudentsLoading(false);
    }
  }, [user, id]);

  return (
    <div className={styles.main}>
      <Header placeholderPart="subject" />

      {subject && (
        <>
          <header className={styles.header}>
            <div className={styles.headerItems}>
              <p className={styles.headerText}>{subject.name}</p>
              <button
                className={styles.headerBtn}
                onClick={() => setOpenSubjectBD(true)}
              >
                Assign to classroom
              </button>
            </div>

            <section className={styles.boxes}>
              <div className={styles.box}>
                <div className={styles.boxLabel}>Total Students</div>
                <div className={styles.boxStats}>
                  <p className={styles.boxMainStat}>
                    {totalStudentsLoading ? (
                      <CircularProgress />
                    ) : totalStudents > 0 ? (
                      totalStudents
                    ) : (
                      0
                    )}
                  </p>
                </div>
              </div>
              <div className={styles.box}>
                <div className={styles.boxLabel}>Average Grades</div>
                <div className={styles.boxStats}>
                  <p className={styles.boxMainStat}>
                    {performanceLoading ? (
                      <CircularProgress />
                    ) : performance > 0 ? (
                      performance
                    ) : (
                      0
                    )}
                  </p>
                </div>
              </div>

              <div className={styles.box}>
                <div className={styles.boxLabel}>Total Teachers</div>
                <div className={styles.boxStats}>
                  <p className={styles.boxMainStat}>20</p>
                </div>
              </div>
            </section>
          </header>
        </>
      )}
      <AssignSubjectBd
        open={openSubjectBD}
        setOpen={setOpenSubjectBD}
        user={user}
        id={""}
        subject={subject}
      />
    </div>
  );
}

export default Subjects;
