import React, { useEffect, useState } from "react";
import styles from "../Backdrop.module.css";
import {
  Backdrop,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { createStudent, markGrade } from "../../../../../api/database";
import { db } from "../../../../../firebaseConfig";
import {
  DocumentData,
  collection,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";

interface Props {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  user: DocumentData | undefined;
  classroom: DocumentData | undefined;
  assessment: DocumentData;
  subject: DocumentData | null;
  setSubjectArg: React.Dispatch<any> | null;
  setAssessmentArg: React.Dispatch<any>;
  idStudent: string;
}

function GradeGeneralBD({
  open,
  setOpen,
  user,
  classroom,
  assessment,
  subject,
  setAssessmentArg,
  idStudent,
}: Props) {
  const [mark, setMark] = useState("");
  const [subjectId, setSubjectId] = useState(subject ? subject.id : "");
  const [studentId, setStudentId] = useState(idStudent);

  const [disabled, setDisabled] = useState(true);

  const studentsRef =
    user && collection(db, "schools", user.schoolId, "students");

  const studentsQuery = studentsRef && query(studentsRef, orderBy("name"));

  const [students] = useCollectionData(studentsQuery);

  const subjectsRef =
    user && collection(db, "schools", user.schoolId, "subjects");

  const subjectsQuery = subjectsRef && query(subjectsRef, orderBy("name"));

  const [subjects] = useCollectionData(subjectsQuery);

  const handleChangeStudent = (event: SelectChangeEvent) => {
    setStudentId(event.target.value);
  };

  const handleChangeSubject = (event: SelectChangeEvent) => {
    setSubjectId(event.target.value);
  };

  const handleSubmit = () => {
    if (user && classroom && mark.length > 0) {
      markGrade(
        assessment.id,
        mark,
        user.schoolId,
        classroom.id,
        subjectId,
        studentId
      );
      setMark("");
      setAssessmentArg(null);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setAssessmentArg(null);
    setOpen(false);
  };

  useEffect(() => {
    if (mark.length > 0) setDisabled(false);
  }, [mark]);

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <div className={styles.container}>
        <div className={styles.header}>Grade on {assessment.name}</div>

        <FormControl fullWidth sx={{ marginBottom: "1rem" }}>
          <InputLabel id="demo-simple-select-label">Student</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={studentId}
            label="Classroom"
            onChange={handleChangeStudent}
            className={styles.select}
          >
            {students &&
              students.map((student: any) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Subject</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={subjectId}
            label="Subject"
            onChange={handleChangeSubject}
            className={styles.select}
          >
            {subjects &&
              subjects.map((subject: any) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <input
          className={styles.input}
          type="text"
          autoCapitalize="words"
          value={mark}
          onChange={(e) => setMark(e.target.value)}
          placeholder="What is the grade?"
        />

        <button
          style={{ opacity: disabled ? 0.7 : 1 }}
          className={styles.btn}
          disabled={disabled}
          onClick={handleSubmit}
        >
          Mark Grade
        </button>

        <button className={styles.cancelBtn} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </Backdrop>
  );
}

export default GradeGeneralBD;
