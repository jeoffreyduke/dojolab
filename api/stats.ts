import { DocumentData } from "firebase/firestore";
import {
  getAllClassrooms,
  getAllSubjects,
  getAssessmentsForStudentAndSubject,
  getStudentsInClassroom,
  getSubjectIdsForClassroom,
} from "./fetchDatabase";

export const calculateAverage = (numbers: number[]): number => {
  const validNumbers = numbers.filter((number) => !isNaN(number));
  const sum = validNumbers.reduce((a, b) => a + b, 0);
  const avg = sum / validNumbers.length;
  return +parseFloat(avg.toString()).toFixed(1);
};

export const calculateStudentPerformanceForSubject = async (
  user: DocumentData,
  student: DocumentData,
  subjectId: string
): Promise<number> => {
  const assessments = await getAssessmentsForStudentAndSubject(
    user,
    student,
    subjectId
  );
  const grades = assessments.map((assessment) => +assessment.grade);
  const averageGrade = calculateAverage(grades);
  return averageGrade;
};

export const calculateStudentPerformanceForAllSubjects = async (
  user: DocumentData,
  student: DocumentData
): Promise<number> => {
  const subjects = await getAllSubjects(user);

  const subjectPerformances = await Promise.all(
    subjects.map((subject) =>
      calculateStudentPerformanceForSubject(user, student, subject.id)
    )
  );
  const averagePerformance = calculateAverage(subjectPerformances);
  if (isNaN(averagePerformance)) {
    return 0;
  }
  return averagePerformance;
};

// 2. Classroom Performance
export const calculateClassroomPerformanceForSubject = async (
  user: DocumentData,
  classroomId: string,
  subjectId: string
): Promise<number> => {
  const students = await getStudentsInClassroom(user, classroomId);
  const studentPerformances = await Promise.all(
    students.map((student) =>
      calculateStudentPerformanceForSubject(user, student, subjectId)
    )
  );
  const averagePerformance = calculateAverage(studentPerformances);
  return averagePerformance;
};

export const calculateClassroomPerformanceForAllSubjects = async (
  user: DocumentData,
  classroomId: string
): Promise<number> => {
  const subjects = await getAllSubjects(user);
  const subjectPerformances = await Promise.all(
    subjects.map((subject) =>
      calculateClassroomPerformanceForSubject(user, classroomId, subject.id)
    )
  );
  const averagePerformance = calculateAverage(subjectPerformances);
  return averagePerformance;
};

// 3. Overall Performance
export const calculateOverallPerformanceForSubject = async (
  user: DocumentData,
  subjectId: string
): Promise<number> => {
  const classrooms = await getAllClassrooms(user);
  const classroomPerformances = await Promise.all(
    classrooms.map((classroom) =>
      calculateClassroomPerformanceForSubject(user, classroom.id, subjectId)
    )
  );
  const averagePerformance = calculateAverage(classroomPerformances);
  return averagePerformance;
};

export const calculateOverallPerformanceForAllSubjects = async (
  user: DocumentData
): Promise<number> => {
  const subjects = await getAllSubjects(user);
  const subjectPerformances = await Promise.all(
    subjects.map((subject) =>
      calculateOverallPerformanceForSubject(user, subject.id)
    )
  );
  const averagePerformance = calculateAverage(subjectPerformances);
  return averagePerformance;
};

export const countStudentsTakingSubject = async (
  user: DocumentData,
  subjectId: string
): Promise<number> => {
  const classrooms = await getAllClassrooms(user);
  let studentCount = 0;

  for (let classroom of classrooms) {
    const subjectIds = await getSubjectIdsForClassroom(user, classroom.id);
    if (subjectIds.includes(subjectId)) {
      const students = await getStudentsInClassroom(user, classroom.id);
      studentCount += students.length;
    }
  }

  return studentCount;
};
