import React, { useEffect, useState } from "react";
import styles from "../Backdrop.module.css";
import { Backdrop } from "@mui/material";
import { createClassroom } from "../../../../../api/database";
import { db } from "../../../../../firebaseConfig";
import { DocumentData, doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

interface Props {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  user: DocumentData | undefined;
}

function ClassroomBD({ open, setOpen, user }: Props) {
  const schoolRef = user && doc(db, "schools", user.schoolId);
  const [school] = useDocumentData(schoolRef);

  const [name, setName] = useState("");

  const [disabled, setDisabled] = useState(true);

  const handleSubmit = () => {
    if (user) {
      console.log("clicked");
      createClassroom(user.schoolId, name);
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
        <div className={styles.header}>Create a classroom</div>
        <input
          className={styles.input}
          type="text"
          autoCapitalize="words"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What is the name of this classroom?"
        />

        <button
          style={{ opacity: disabled ? 0.7 : 1 }}
          className={styles.btn}
          disabled={disabled}
          onClick={handleSubmit}
        >
          Create
        </button>

        <button className={styles.cancelBtn} onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </Backdrop>
  );
}

export default ClassroomBD;
