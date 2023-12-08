import {
  Backdrop,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { DocumentData, collection, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styles from "../Backdrop.module.css";
import { db } from "../../../../../firebaseConfig";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { updateSubjectClassroomsId } from "../../../../../api/database";

interface Props {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  user: DocumentData | undefined;
  id: string;
  subject: DocumentData | undefined;
}

function AssignSubjectBd({ open, setOpen, user, id, subject }: Props) {
  const subjectsRef =
    user && collection(db, "schools", user.schoolId, "subjects");

  const subjectsQuery = subjectsRef && query(subjectsRef, orderBy("name"));

  const [subjects] = useCollectionData(subjectsQuery);

  const classroomsRef =
    user && collection(db, "schools", user.schoolId, "classrooms");

  const classroomsQuery =
    classroomsRef && query(classroomsRef, orderBy("createdAt"));

  const [classrooms] = useCollectionData(classroomsQuery);

  const [name, setName] = useState("");
  const [classroomId, setClassroomId] = useState(id);
  const [assignedClassrooms, setAssignedClassrooms] = useState<any[]>([]);

  const [disabled, setDisabled] = useState(true);

  const handleChange = (event: SelectChangeEvent) => {
    setClassroomId(event.target.value);
  };

  const handleSubmit = () => {
    if (user && subject) {
      updateSubjectClassroomsId(
        user.schoolId,
        subject.id,
        subject.name,
        classroomId
      );
      setClassroomId("");
      setOpen(false);
    }
  };

  useEffect(() => {
    if (classroomId.length > 0) setDisabled(false);
  }, [classroomId]);

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <div className={styles.container}>
        <div className={styles.header}>Assign to a classroom</div>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Classroom</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={classroomId}
            label="subject"
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
          Assign
        </button>

        <button className={styles.cancelBtn} onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </Backdrop>
  );
}

export default AssignSubjectBd;
