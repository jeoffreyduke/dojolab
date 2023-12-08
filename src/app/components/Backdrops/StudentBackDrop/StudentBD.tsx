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
import { createStudent } from "../../../../../api/database";
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
  id: string;
}

function StudentBD({ open, setOpen, user, id }: Props) {
  const classroomsRef =
    user && collection(db, "schools", user.schoolId, "classrooms");

  const classroomsQuery =
    classroomsRef && query(classroomsRef, orderBy("createdAt"));

  const [classrooms] = useCollectionData(classroomsQuery);

  const [name, setName] = useState("");
  const [classroomId, setClassroomId] = useState(id);

  const [disabled, setDisabled] = useState(true);

  const handleChange = (event: SelectChangeEvent) => {
    setClassroomId(event.target.value);
  };

  const handleSubmit = () => {
    if (user) {
      createStudent(user.schoolId, name, classroomId);
      setName("");
      setOpen(false);
    }
  };

  useEffect(() => {
    if (name.length > 0 && classroomId.length > 0) setDisabled(false);
  }, [name, classroomId]);

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <div className={styles.container}>
        <div className={styles.header}>Add a new student</div>

        <input
          className={styles.input}
          type="text"
          autoCapitalize="words"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What is the name of this student?"
        />

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Classroom</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={classroomId}
            label="Classroom"
            onChange={handleChange}
            className={styles.select}
          >
            {classrooms &&
              classrooms.map((classroom: any) => (
                <MenuItem key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <button
          style={{ opacity: disabled ? 0.7 : 1 }}
          className={styles.btn}
          disabled={disabled}
          onClick={handleSubmit}
        >
          Add student
        </button>

        <button className={styles.cancelBtn} onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </Backdrop>
  );
}

export default StudentBD;
