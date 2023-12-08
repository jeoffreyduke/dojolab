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
import { addAssessment, createStudent } from "../../../../../api/database";
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
  classroom: DocumentData;
}

function AssessmentBD({ open, setOpen, user, classroom }: Props) {
  const classroomsRef =
    user && collection(db, "schools", user.schoolId, "classrooms");

  const classroomsQuery =
    classroomsRef && query(classroomsRef, orderBy("createdAt"));

  const [classrooms] = useCollectionData(classroomsQuery);

  const [name, setName] = useState("");

  const [disabled, setDisabled] = useState(true);

  const handleSubmit = () => {
    if (user) {
      addAssessment(name, user.schoolId, classroom.id);
      setName("");
      setOpen(false);
    }
  };

  useEffect(() => {
    if (name.length > 0) setDisabled(false);
  }, [name]);

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <div className={styles.container}>
        <div className={styles.header}>Add a new assessment</div>

        <input
          className={styles.input}
          type="text"
          autoCapitalize="words"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What will you call this assessment?"
        />

        <button
          style={{ opacity: disabled ? 0.7 : 1 }}
          className={styles.btn}
          disabled={disabled}
          onClick={handleSubmit}
        >
          Add assessment
        </button>

        <button className={styles.cancelBtn} onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </Backdrop>
  );
}

export default AssessmentBD;
