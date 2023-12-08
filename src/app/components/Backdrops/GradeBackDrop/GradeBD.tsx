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
  student: DocumentData;
  subject: DocumentData;
  setSubjectArg: React.Dispatch<any>;
  setAssessmentArg: React.Dispatch<any>;
}

function GradeBD({
  open,
  setOpen,
  user,
  classroom,
  assessment,
  student,
  subject,
  setSubjectArg,
  setAssessmentArg,
}: Props) {
  const [mark, setMark] = useState("");

  const [disabled, setDisabled] = useState(true);

  const handleSubmit = () => {
    if (user && classroom && mark.length > 0) {
      markGrade(
        assessment.id,
        mark,
        user.schoolId,
        classroom.id,
        subject.id,
        student.id
      );
      setMark("");
      setSubjectArg(null);
      setAssessmentArg(null);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setSubjectArg(null);
    setAssessmentArg(null);
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

export default GradeBD;
