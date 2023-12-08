"use client";
import React, { useEffect, useState } from "react";
import styles from "./Classroom.module.css";
import { useDispatch, useSelector } from "react-redux";
import { handleCurrClassroom } from "../../../provider/currClassroomSlice";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Header from "../components/Header/Header";
import StudentBD from "../components/Backdrops/StudentBackDrop/StudentBD";
import { useRouter } from "next/navigation";
import { handleCurrProfile } from "../../../provider/currProfileSlice";
import Assessments from "./components/assessments/Assessments";
import { Add } from "@mui/icons-material";
import AssessmentBD from "../components/Backdrops/AssessmentBackDrop/AssessmentBD";
import GradeBD from "../components/Backdrops/GradeBackDrop/GradeBD";
import {
  calculateAttendanceForAllStudents,
  fetchStudentAttendance,
} from "../../../api/reusableFunctions/generalFunctions";
import {
  calculateClassroomPerformanceForAllSubjects,
  calculateStudentPerformanceForAllSubjects,
} from "../../../api/stats";
import { CircularProgress, Avatar } from "@mui/material";
import { handleStudentPerformance } from "../../../provider/studentPerformanceSlice";
import { handleClassroomUpdated } from "../../../provider/classroomUpdatedSlice";
import { handleStudentAttendance } from "../../../provider/studentAttendanceSlice";

function Classroom() {
  const [User] = useAuthState(auth);
  const userRef = User && doc(db, "users", User.uid);
  const [user] = useDocumentData(userRef);

  const router = useRouter();

  const dispatch = useDispatch();
  const selector = useSelector(handleCurrClassroom);
  const id = selector.payload.classroom.value;
  const studentPerformance = selector.payload.studentPerformance.value;
  const studentAttendance = selector.payload.studentAttendance.value;
  const classroomUpdated = selector.payload.classroomUpdated.value;

  const [openStudentBD, setOpenStudentBD] = useState(false);
  const [openAssessmentBD, setOpenAssessmentBD] = useState(false);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [attendancePercentageLoading, setAttendancePercentageLoading] =
    useState(false);
  const [performance, setPerformance] = useState(0);
  const [performanceLoading, setPerformanceLoading] = useState(false);

  const classroomsRef =
    user && doc(db, "schools", user.schoolId, "classrooms", id);

  const [classroom] = useDocumentData(classroomsRef);

  const studentsRef =
    user && collection(db, "schools", user.schoolId, "students");

  const studentsQuery = studentsRef && query(studentsRef, orderBy("name"));

  const [rawStudents] = useCollectionData(studentsQuery);
  const students: any = rawStudents?.filter(
    (student) => student.classroomId === id
  );

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
        console.log(attendancePercent);
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
        const performanceData =
          await calculateClassroomPerformanceForAllSubjects(user, id);
        console.log(performanceData, "performance");
        setPerformance(performanceData);
      };
      fetchPerformance();
      setPerformanceLoading(false);
    }
  }, [user, id]);

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

    if (currentDate - classroomUpdated > 30 * 60 * 1000) {
      if (user && rawStudents) {
        const fetchAttendance = async () => {
          const attendance: any = {};
          for (let student of rawStudents) {
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

    if (currentDate - classroomUpdated > 30 * 60 * 1000) {
      if (user && rawStudents) {
        const fetchPerformance = async () => {
          const performance: any = {};
          for (let student of rawStudents) {
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
          dispatch(handleClassroomUpdated(Date.now()));
        };

        fetchPerformance();
      }
    }
  }, [user, students]);

  return (
    <div className={styles.main}>
      {classroom && (
        <>
          <Header placeholderPart={`${classroom.name} students`} />
          <header className={styles.header}>
            <div className={styles.headerItems}>
              <p className={styles.headerText}>{classroom.name}</p>
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
                      <CircularProgress />
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
                      <CircularProgress />
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

          <section className={styles.studentsCon}>
            <p className={styles.title}>Assessments</p>
            <div className={styles.assessments}>
              <div
                className={styles.create}
                onClick={() => setOpenAssessmentBD(true)}
              >
                <Add />
                Create Assessment
              </div>
              <Assessments user={user} classroom={classroom} />
            </div>
          </section>

          <StudentBD
            open={openStudentBD}
            setOpen={setOpenStudentBD}
            user={user}
            id={id}
          />

          <AssessmentBD
            open={openAssessmentBD}
            setOpen={setOpenAssessmentBD}
            user={user}
            classroom={classroom}
          />
        </>
      )}
    </div>
  );
}

export default Classroom;
