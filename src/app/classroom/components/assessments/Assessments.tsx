import React, { useState } from "react";
import styles from "./Assessments.module.css";
import Header from "@/app/components/Header/Header";
import { handleCurrSubject } from "../../../../../provider/currSubjectSlice";
import { useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../../../firebaseConfig";
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
import GradeBD from "@/app/components/Backdrops/GradeBackDrop/GradeBD";
import GradeGeneralBD from "@/app/components/Backdrops/GradeBackDrop/GradeGeneralBD";

interface Props {
  user: DocumentData | undefined;
  classroom: DocumentData;
}

function Assessments({ user, classroom }: Props) {
  const [openAssessmentBD, setOpenAssessmentBD] = useState(false);
  const [open, setOpen] = useState(false);
  const [assessment, setAssessment] = useState<any>(null);

  const assessmentsRef =
    user &&
    collection(
      db,
      "schools",
      user.schoolId,
      "classrooms",
      classroom.id,
      "assessments"
    );

  const assessmentsQuery =
    assessmentsRef && query(assessmentsRef, orderBy("createdAt"));

  const [assessments] = useCollectionData(assessmentsQuery);

  const handleShowBackDrop = (assessment: any) => {
    setAssessment(assessment);
    setOpen(true);
  };

  return (
    <div className={styles.main}>
      {assessments?.map((assessment: any) => (
        <div key={assessment.id}>
          <div
            className={styles.assessment}
            onClick={() => handleShowBackDrop(assessment)}
          >
            {assessment.name}
          </div>
        </div>
      ))}
      {assessment && (
        <GradeGeneralBD
          open={open}
          setOpen={setOpen}
          user={user}
          classroom={classroom}
          assessment={assessment}
          subject={null}
          idStudent={""}
          setSubjectArg={null}
          setAssessmentArg={setAssessment}
        />
      )}
    </div>
  );
}

export default Assessments;
