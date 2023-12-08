"use client";
import React, { useEffect, useState } from "react";
import styles from "./Students.module.css";
import Header from "../../components/Header/Header";
import StudentBD from "@/app/components/Backdrops/StudentBackDrop/StudentBD";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../../firebaseConfig";
import {
  DocumentData,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { handleCurrProfile } from "../../../../provider/currProfileSlice";
import {
  calculateAttendanceForAllStudents,
  calculateAttendancePercentage,
  fetchStudentAttendance,
  getAttendance,
} from "../../../../api/reusableFunctions/generalFunctions";
import {
  calculateOverallPerformanceForAllSubjects,
  calculateStudentPerformanceForAllSubjects,
} from "../../../../api/stats";
import { CircularProgress, Avatar } from "@mui/material";
import { handleStudentPerformance } from "../../../../provider/studentPerformanceSlice";
import { handleStudentAttendance } from "../../../../provider/studentAttendanceSlice";
import { handleStudentsUpdated } from "../../../../provider/studentsUpdatedSlice";

function Students() {
  const [openStudentBD, setOpenStudentBD] = useState(false);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [attendancePercentageLoading, setAttendancePercentageLoading] =
    useState(false);
  const [performance, setPerformance] = useState(0);
  const [performanceLoading, setPerformanceLoading] = useState(false);

  const [User] = useAuthState(auth);
  const userRef = User && doc(db, "users", User.uid);
  const [user] = useDocumentData(userRef);

  const router = useRouter();
  const dispatch = useDispatch();

  const selector = useSelector(handleStudentPerformance);
  const studentPerformance = selector.payload.studentPerformance.value;
  const studentAttendance = selector.payload.studentAttendance.value;
  const studentsUpdated = selector.payload.studentsUpdated.value;

  const studentsRef =
    user && collection(db, "schools", user.schoolId, "students");

  const studentsQuery = studentsRef && query(studentsRef, orderBy("name"));

  const [students] = useCollectionData(studentsQuery);

  const navigateProfile = (id: string) => {
    dispatch(handleCurrProfile(id));
    router.push("/profile");
    console.log("clicked");
  };

  useEffect(() => {
    setAttendancePercentageLoading(true);

    if (user && students) {
      const fetchAttendance = async () => {
        const attendancePercent = await calculateAttendanceForAllStudents(
          students,
          user
        );
        setAttendancePercentage(attendancePercent);
      };
      fetchAttendance();
      setAttendancePercentageLoading(false);
    }
  }, [user, students]);

  useEffect(() => {
    setPerformanceLoading(true);

    if (user) {
      const fetchPerformance = async () => {
        const performanceData = await calculateOverallPerformanceForAllSubjects(
          user
        );
        if (typeof performanceData === "number")
          setPerformance(performanceData);
      };
      fetchPerformance();
      setPerformanceLoading(false);
    }
  }, [user]);

  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: "1.5rem",
        height: "1.5rem",
        fontSize: "0.8rem",
        marginRight: "1rem",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  //const [studentAttendance, setStudentAttendance] = useState<any>({});
  //const [studentPerformance, setStudentPerformance] = useState<any>({});

  useEffect(() => {
    const currentDate = new Date().getTime();

    if (currentDate - studentsUpdated > 30 * 60 * 1000) {
      if (user && students) {
        const fetchAttendance = async () => {
          const attendance: any = {};
          for (let student of students) {
            attendance[student.id] = user
              ? isNaN(await fetchStudentAttendance(user, student.id))
                ? 0
                : await fetchStudentAttendance(user, student.id)
              : 0;
          }
          //setStudentAttendance(attendance);
          dispatch(handleStudentAttendance(attendance));
        };

        fetchAttendance();
      }
    }
  }, [user, students]);

  useEffect(() => {
    const currentDate = new Date().getTime();

    if (currentDate - studentsUpdated > 30 * 60 * 1000) {
      if (user && students) {
        const fetchPerformance = async () => {
          const performance: any = {};
          for (let student of students) {
            performance[student.id] = user
              ? isNaN(
                  await calculateStudentPerformanceForAllSubjects(user, student)
                )
                ? 0
                : await calculateStudentPerformanceForAllSubjects(user, student)
              : 0;
          }
          //setStudentPerformance(performance);
          dispatch(handleStudentPerformance(performance));
          dispatch(handleStudentsUpdated(Date.now()));
        };

        fetchPerformance();
      }
    }
  }, [user, students]);

  return (
    <div className={styles.main}>
      <Header placeholderPart="students" />
      <header className={styles.header}>
        <div className={styles.headerItems}>
          <p className={styles.headerText}>Students</p>
          <button
            className={styles.headerBtn}
            onClick={() => setOpenStudentBD(!openStudentBD)}
          >
            Add new student
          </button>
        </div>
        <section className={styles.boxes}>
          <div className={styles.box}>
            <div className={styles.boxLabel}>Total Students</div>
            <div className={styles.boxStats}>
              <p className={styles.boxMainStat}>{students?.length}</p>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxLabel}>Attendance (%)</div>
            <div className={styles.boxStats}>
              <p className={styles.boxMainStat}>
                {attendancePercentageLoading ? (
                  <CircularProgress size={"1.2rem"} />
                ) : attendancePercentage > 0 ? (
                  attendancePercentage
                ) : (
                  0
                )}
              </p>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxLabel}>Performance (%)</div>
            <div className={styles.boxStats}>
              <p className={styles.boxMainStat}>
                {performanceLoading ? (
                  <CircularProgress size={"1.2rem"} />
                ) : performance > 0 ? (
                  performance
                ) : (
                  0
                )}
              </p>
            </div>
          </div>
        </section>
      </header>

      <section className={styles.studentsCon}>
        <p className={styles.title}>Students</p>
        <main className={styles.students}>
          <div className={`${styles.studentCon} ${styles.studentConName}`}>
            <p
              className={`${styles.studentHeader} ${styles.studentHeaderName}`}
            >
              Name
            </p>

            {students &&
              students.map((student: any) => (
                <div
                  className={styles.student}
                  onClick={() => navigateProfile(student.id)}
                >
                  <Avatar {...stringAvatar(student.name)} />
                  {student.name}
                </div>
              ))}
          </div>

          <div className={styles.studentCon}>
            <p className={styles.studentHeader}>Attendance</p>

            {students &&
              students.map((student: any) => (
                <div
                  className={styles.studentStat}
                  onClick={() => navigateProfile(student.id)}
                >
                  {isNaN(studentAttendance[student.id]) ? (
                    <CircularProgress size={"1.2rem"} />
                  ) : (
                    `${studentAttendance[student.id]}%`
                  )}
                </div>
              ))}
          </div>

          <div className={styles.studentCon}>
            <p className={styles.studentHeader}>Performance</p>

            {students &&
              students.map((student: any) => (
                <div
                  className={styles.studentStat}
                  onClick={() => navigateProfile(student.id)}
                >
                  {isNaN(studentPerformance[student.id]) ? (
                    <CircularProgress size={"1.2rem"} />
                  ) : (
                    `${studentPerformance[student.id]}%`
                  )}
                </div>
              ))}
          </div>
        </main>
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

export default Students;
