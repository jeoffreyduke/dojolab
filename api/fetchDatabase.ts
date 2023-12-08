import {
  DocumentData,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// 1. getAssessmentsForStudentAndSubject
export const getAssessmentsForStudentAndSubject = async (
  user: DocumentData,
  student: DocumentData,
  subjectId: string
): Promise<any[]> => {
  const assessmentsRef = collection(
    db,
    "schools",
    user.schoolId,
    "classrooms",
    student.classroomId,
    "assessments"
  );

  const querySnapshot = await getDocs(assessmentsRef);
  const assessments = [];
  for (let document of querySnapshot.docs) {
    const assessmentData = document.data() as any;
    const gradesRef = doc(
      db,
      "schools",
      user.schoolId,
      "classrooms",
      student.classroomId,
      "assessments",
      assessmentData.id,
      subjectId,
      student.id
    );
    const gradeDoc = await getDoc(gradesRef);
    if (gradeDoc.exists()) {
      const gradeData: any = gradeDoc.data();
      assessments.push({ ...assessmentData, grade: gradeData.grade });
    }
  }
  return assessments;
};

export const getSubjectIdsForClassroom = async (
  user: DocumentData,
  classroomId: string
): Promise<any[]> => {
  const assessmentsRef = collection(
    db,
    "schools",
    user.schoolId,
    "classrooms",
    classroomId,
    "subjectIds"
  );

  const querySnapshot = await getDocs(assessmentsRef);
  const subjectIds = querySnapshot.docs.map((doc) => doc.id as any);
  return subjectIds;
};

// 2. getAllSubjects
export const getAllSubjects = async (user: DocumentData): Promise<any[]> => {
  const subjectsRef =
    user && collection(db, "schools", user.schoolId, "subjects");
  const querySnapshot = await getDocs(subjectsRef);
  const subjects = querySnapshot.docs.map((doc) => doc.data() as any);
  return subjects;
};

// 3. getStudentsInClassroom
export const getStudentsInClassroom = async (
  user: DocumentData,
  classroomId: string
): Promise<any[]> => {
  const studentsRef =
    user && collection(db, "schools", user.schoolId, "students");

  const studentsQuery = query(
    studentsRef,
    where("classroomId", "==", classroomId)
  );
  const querySnapshot = await getDocs(studentsQuery);
  const students = querySnapshot.docs.map((doc) => doc.data() as any);
  return students;
};

// 4. getAllClassrooms
export const getAllClassrooms = async (user: DocumentData): Promise<any[]> => {
  const classroomsRef =
    user && collection(db, "schools", user.schoolId, "classrooms");
  const querySnapshot = await getDocs(classroomsRef);
  const classrooms = querySnapshot.docs.map((doc) => doc.data() as any);
  return classrooms;
};
