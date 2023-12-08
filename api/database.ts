import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { toCamelCase } from "./reusableFunctions/generalFunctions";

export function clearAllSchools() {
  const userRef = doc(db, "schools/");

  deleteDoc(userRef);
}

export function deleteSchool(uid: any) {
  const userRef = doc(db, "schools/" + uid);

  deleteDoc(userRef);
}

export function createUser(
  userId: any,
  schoolId: any,
  name: string | null,
  email: string | null,
  phone: string | null,
  password: string | null,
  profilePic: any,
  role: string | null
) {
  const usersRef = doc(db, "users", userId);

  setDoc(usersRef, {
    id: userId,
    schoolId,
    name,
    email,
    notificationStatus: true,
    phone,
    password,
    joined: serverTimestamp(),
    profilePic,
    role,
  });
}

export function createSchool(
  schoolName: string | null,
  schoolEmail: string | null,
  userId: any,
  name: string | null,
  email: string | null,
  phone: string | null,
  password: string | null,
  profilePic: any,
  role: string | null
) {
  const schoolRef = collection(db, "schools");

  addDoc(schoolRef, {
    id: "",
    schoolName,
    schoolEmail,
    created: serverTimestamp(),
    logo: "",
  }).then((school: any) => {
    const schoolRef = doc(db, "schools", school.id);

    updateDoc(schoolRef, {
      id: school.id,
    });

    createUser(
      userId,
      school.id,
      name,
      email,
      phone,
      password,
      profilePic,
      role
    );
  });
}

export function createClassroom(schoolId: any, name: string | null) {
  const classroomsRef = collection(db, "schools", schoolId, "classrooms");

  addDoc(classroomsRef, {
    id: "",
    name,
    createdAt: serverTimestamp(),
  }).then((classroom: any) => {
    const classroomRef = doc(
      db,
      "schools",
      schoolId,
      "classrooms",
      classroom.id
    );

    updateDoc(classroomRef, {
      id: classroom.id,
    });
  });
}

export function createStudent(
  schoolId: any,
  name: string | null,
  classroomId: string | null
) {
  const studentsRef = collection(db, "schools", schoolId, "students");

  addDoc(studentsRef, {
    id: "",
    name,
    classroomId,
    createdAt: serverTimestamp(),
  }).then((student: any) => {
    const studentRef = doc(db, "schools", schoolId, "students", student.id);

    updateDoc(studentRef, {
      id: student.id,
    });
  });
}

export function markAttendance(id: string, schoolId: any, studentId: string) {
  const studentRef = doc(
    db,
    "schools",
    schoolId,
    "students",
    studentId,
    "attendance",
    id
  );

  setDoc(studentRef, {
    id,
    createdAt: serverTimestamp(),
  });
}

export function deleteAttendance(id: string, schoolId: any, studentId: string) {
  const studentRef = doc(
    db,
    "schools",
    schoolId,
    "students",
    studentId,
    "attendance",
    id
  );

  deleteDoc(studentRef);
}

export function addAssessment(
  name: string,
  schoolId: string,
  classroomId: string
) {
  const assessmentsRef = collection(
    db,
    "schools",
    schoolId,
    "classrooms",
    classroomId,
    "assessments"
  );
  addDoc(assessmentsRef, {
    id: "",
    name,
    classroomId,
    createdAt: serverTimestamp(),
  }).then((assessment) => {
    const assessmentRef = doc(
      db,
      "schools",
      schoolId,
      "classrooms",
      classroomId,
      "assessments",
      assessment.id
    );

    updateDoc(assessmentRef, {
      id: assessment.id,
    });
  });
}

export function markGrade(
  id: string,
  grade: string,
  schoolId: any,
  classroomId: string,
  subjectId: string,
  studentId: string
) {
  const gradesRef = doc(
    db,
    "schools",
    schoolId,
    "classrooms",
    classroomId,
    "assessments",
    id,
    subjectId,
    studentId
  );

  setDoc(gradesRef, {
    id: studentId,
    subjectId,
    grade,
    createdAt: serverTimestamp(),
  });
}

export function deleteGrade(id: string, schoolId: any, studentId: string) {
  const gradeRef = doc(
    db,
    "schools",
    schoolId,
    "students",
    studentId,
    "attendance",
    id
  );

  deleteDoc(gradeRef);
}

export function createSubject(schoolId: any, name: string | null) {
  const subjectsRef = collection(db, "schools", schoolId, "subjects");

  addDoc(subjectsRef, {
    id: "",
    name,
    createdAt: serverTimestamp(),
  }).then((subject: any) => {
    const subjectRef = doc(db, "schools", schoolId, "subjects", subject.id);

    updateDoc(subjectRef, {
      id: subject.id,
    });
  });
}

export function updateSubjectClassroomsId(
  schoolId: any,
  id: string,
  name: string,
  classroomId: string
) {
  const classroomRef = doc(
    db,
    "schools",
    schoolId,
    "classrooms",
    classroomId,
    "subjectIds",
    id
  );

  setDoc(classroomRef, {
    id,
    name,
  });
}

export function createRole(schoolId: any, name: string | null) {
  const rolesRef = collection(db, "schools", schoolId, "roles");

  addDoc(rolesRef, {
    id: "",
    name,
    createdAt: serverTimestamp(),
  }).then((role: any) => {
    const roleRef = doc(db, "schools", schoolId, "roles", role.id);

    updateDoc(roleRef, {
      id: role.id,
    });
  });
}

export function createRoleInvite(
  email: string,
  schoolId: string,
  role: string
) {
  const invitesRef = collection(db, "invites");

  addDoc(invitesRef, {
    id: "",
    schoolId,
    role,
    createdAt: serverTimestamp(),
  }).then((invite: any) => {
    const inviteRef = doc(db, "invites", invite.id);

    updateDoc(inviteRef, {
      id: invite.id,
    });
  });
}

export function deleteeRoleInvite(inviteId: string) {
  const inviteRef = doc(db, "invites", inviteId);

  deleteDoc(inviteRef);
}

export function assignRole(
  schoolId: any,
  name: string | null,
  roleId: string,
  userId: string
) {
  const rolesRef = collection(db, "schools", schoolId, "roles", roleId, userId);

  addDoc(rolesRef, {
    id: userId,
    name,
    createdAt: serverTimestamp(),
  });
}

export const updateSchoolLogo = (userId: any, imageUrl: string) => {
  const userRef = doc(db, "users", userId);

  updateDoc(userRef, {
    profilePic: imageUrl,
  });
};

export function updateUserPassword(userId: any, password: string) {
  const userPasswordRef = doc(db, "users", userId);

  updateDoc(userPasswordRef, {
    password,
  });
}

export function updateUserName(userId: any, name: string) {
  const userRef = doc(db, "users", userId);

  updateDoc(userRef, {
    name,
  });
}

export function updateUserEmail(userId: any, email: string) {
  const userRef = doc(db, "users", userId);

  updateDoc(userRef, {
    email,
  });
}

export function updatePassword(userId: any, password: string) {
  const userRef = doc(db, "users", userId);

  updateDoc(userRef, {
    password,
  });
}

export function updateToken(userId: any, token: string) {
  const userRef = doc(db, "users", userId);

  updateDoc(userRef, {
    token,
  });
}

export function updateNotificationStatus(
  userId: string,
  notificationStatus: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>> | null = null
) {
  const userRef = doc(db, "users", userId);

  updateDoc(userRef, {
    notificationStatus,
  }).then(() => {
    if (setLoading !== null) {
      setLoading(false);
    }
  });
}

// add notification into the notification array
export function createNotification(
  userId: any,
  name: any,
  notification: any,
  senderId: any,
  senderDP: any,
  amount: number | null = null,
  promoCode: string | null = null
) {
  const notifsRef = collection(db, "schools/" + `${userId}/notifications`);

  addDoc(notifsRef, {
    id: "",
    notification,
    name,
    senderId,
    senderDP,
    seen: false,
    createdAt: serverTimestamp(),
    amount,
    promoCode,
  }).then((notif) => {
    const notificationRef = doc(db, "users", userId, "notifications", notif.id);

    updateDoc(notificationRef, {
      id: notif.id,
    });
  });
}

export function updateSeen(userId: any, notifId: string) {
  const notifRef = doc(db, "schools/" + `${userId}/notifications/${notifId}`);
  //update(notifRef, { seen: true });
}

export function submitReferral(
  userName: string,
  referredBy: string,
  createdAt: any
) {
  const referralsRef = collection(db, "referrals");

  addDoc(referralsRef, {
    userName,
    referredBy,
    createdAt,
  });
}

export function deleteReferral(id: any) {
  const referralRef = doc(db, "referrals", id);

  deleteDoc(referralRef);
}
