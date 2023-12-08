import React, { useEffect, useState } from "react";
import styles from "../Profile.module.css";
import { DocumentData } from "firebase/firestore";
import GradeBD from "@/app/components/Backdrops/GradeBackDrop/GradeBD";
import GradeGeneralBD from "@/app/components/Backdrops/GradeBackDrop/GradeGeneralBD";
import { CircularProgress } from "@mui/material";

interface Props {
  grades: DocumentData | undefined;
  subjects: DocumentData;
  assessments: DocumentData | undefined;
  getAssessment: (
    assessmentId: string,
    subjectId: string
  ) => Promise<DocumentData | undefined>;
  user: DocumentData;
  classroom: DocumentData | undefined;
  student: DocumentData;
}

function Grades({
  grades,
  subjects,
  assessments,
  getAssessment,
  user,
  classroom,
  student,
}: Props) {
  const [open, setOpen] = useState(false);
  const [openGeneral, setOpenGeneral] = useState(false);
  const [subjectArg, setSubjectArg] = useState<any>(null);
  const [assessmentArg, setAssessmentArg] = useState<any>(null);

  const handleShowBackDrop = (subject: any, assessment: any) => {
    setSubjectArg(subject);
    setAssessmentArg(assessment);
    setOpen(true);
  };

  const handleShowBackDropGeneral = (subject: any, assessment: any) => {
    setSubjectArg(subject);
    console.log(subjectArg);
    setAssessmentArg(assessment);
    setOpenGeneral(true);
  };

  {
    /* const [studentAssessment, setStudentAssessment] = useState<any>({});
  const [studentAssessmentLoading, setStudentAssessmentLoading] =
    useState(false);

  useEffect(() => {
    setStudentAssessmentLoading(true);

    if (assessments && subjects) {
      const fetchAssessments = async () => {
        const newStudentAssessment: any = {};
        for (let assessment of assessments as any[]) {
          newStudentAssessment[assessment.id] = {};
          for (let subject of subjects as any[]) {
            newStudentAssessment[assessment.id][subject.id] =
              await getAssessment(assessment.id, subject.id);
          }
        }
        setStudentAssessment(newStudentAssessment);
        setStudentAssessmentLoading(false);
      };

      fetchAssessments();
    }
  }, [assessments, subjects]); */
  }

  return (
    <>
      {grades && subjects && assessments && (
        <div style={{ display: "flex" }}>
          <div>
            <p className={styles.gradeHeader}>Subject</p>
            {subjects.map((subject: any) => (
              <div className={styles.subjectName}>{subject.name}</div>
            ))}
          </div>
          {assessments.map((assessmentData: any) => (
            <div>
              <p className={styles.gradeHeader}>{assessmentData.name}</p>
              {subjects.map((subject: any) => (
                <>
                  {getAssessment(assessmentData.id, subject.id).then(
                    (assessment: any) =>
                      assessmentData && assessment && assessment.grade ? (
                        <div
                          key={assessmentData.id + Math.random()}
                          className={styles.grades}
                        >
                          <div className={styles.grade}>
                            <div
                              onClick={() =>
                                handleShowBackDrop(subject, assessmentData)
                              }
                            >
                              {assessment.grade}
                            </div>
                          </div>
                          {open && subjectArg && assessmentArg && (
                            <GradeBD
                              open={open}
                              setOpen={setOpen}
                              user={user}
                              classroom={classroom}
                              assessment={assessmentArg}
                              student={student}
                              subject={subjectArg}
                              setSubjectArg={setSubjectArg}
                              setAssessmentArg={setAssessmentArg}
                            />
                          )}
                        </div>
                      ) : (
                        <>
                          <div
                            className={styles.markGrade}
                            onClick={() =>
                              handleShowBackDropGeneral(subject, assessmentData)
                            }
                          >
                            Add Grade
                          </div>

                          {openGeneral && subjectArg && assessmentArg && (
                            <GradeGeneralBD
                              open={openGeneral}
                              setOpen={setOpenGeneral}
                              user={user}
                              classroom={classroom}
                              assessment={assessmentArg}
                              subject={subjectArg}
                              idStudent={student.id}
                              setSubjectArg={setSubjectArg}
                              setAssessmentArg={setAssessmentArg}
                            />
                          )}
                        </>
                      )
                  )}
                </>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Grades;
