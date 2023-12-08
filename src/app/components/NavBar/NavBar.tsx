"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import styles from "./NavBar.module.css";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { app, auth, db } from "../../../../firebaseConfig";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  Home,
  HomeMiniOutlined,
  HomeOutlined,
  HomeRounded,
} from "@mui/icons-material";
import ClassroomBD from "../Backdrops/ClassroomBackDrop/ClassroomBD";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import SubjectBD from "../Backdrops/SubjectBackDrop/SubjectBD";
import { fetchClassrooms } from "../../../../api/fetchClassrooms";
import { useDispatch, useSelector } from "react-redux";
import { handleUser } from "../../../../provider/userSlice";
import store from "../../../../provider/store";
import { handleCurrClassroom } from "../../../../provider/currClassroomSlice";
import { handleCurrSubject } from "../../../../provider/currSubjectSlice";
import {
  ClassroomIcon,
  EarningIcon,
  HomeIcon,
  RolesIcon,
  SubjectIcon,
} from "../../../../public/assets/icons/icons";

function NavBar() {
  const [User] = useAuthState(auth);
  const userRef = User && doc(db, "users", User.uid);
  const [user] = useDocumentData(userRef);

  const dispatch = useDispatch();

  const selector = useSelector(handleCurrClassroom);
  const classroomId = selector.payload.classroom.value;
  const subjectId = selector.payload.subject.value;

  const schoolRef = user && doc(db, "schools", user.schoolId);
  const [school] = useDocumentData(schoolRef);

  const router = useRouter();

  const classroomsRef =
    user && collection(db, "schools", user.schoolId, "classrooms");

  const classroomsQuery =
    classroomsRef && query(classroomsRef, orderBy("createdAt"));

  const [classrooms] = useCollectionData(classroomsQuery);

  const subjectsRef =
    user && collection(db, "schools", user.schoolId, "subjects");

  const subjectsQuery = subjectsRef && query(subjectsRef, orderBy("createdAt"));

  const [subjects] = useCollectionData(subjectsQuery);

  const dashboardRef = useRef<any>(null);
  const classroomRef = useRef<any>(null);
  const subjectRef = useRef<any>(null);
  const financesRef = useRef<any>(null);
  const rolesRef = useRef<any>(null);

  const [isOpen, setIsOpen] = useState({
    dashboard: true,
    classrooms: false,
    subjects: false,
    finances: false,
    roles: false,
  });

  const [openClassroomBD, setOpenClassroomBD] = useState(false);
  const [openSubjectBD, setOpenSubjectBD] = useState(false);

  const navigateClassroom = (id: string) => {
    dispatch(handleCurrClassroom(id));
    router.push("/classroom");
  };

  const navigateSubject = (id: string) => {
    dispatch(handleCurrSubject(id));
    router.push("/subject");
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      window.location.href = "/";
    });
  };

  const pathName = usePathname();
  return (
    <>
      <div className={styles.schoolName}>Empire High</div>
      <div className={styles.navItemCon}>
        <div
          className={
            pathName === "/dashboard/students/" ||
            pathName === "/dashboard/teachers/"
              ? `${styles.navItem} ${styles.activePage}`
              : styles.navItem
          }
          onClick={() =>
            setIsOpen({
              ...isOpen,
              dashboard: !isOpen.dashboard,
            })
          }
        >
          <div className={styles.iconCon}>
            <HomeIcon
              isHere={
                pathName === "/dashboard/students/" ||
                pathName === "/dashboard/teachers/"
              }
            />
            <p>Dashboard</p>
          </div>
          {isOpen.dashboard ? (
            <ArrowDropUp
              sx={{
                marginLeft: "1rem",
              }}
            />
          ) : (
            <ArrowDropDown
              sx={{
                marginLeft: "1rem",
              }}
            />
          )}
        </div>

        {isOpen.dashboard && (
          <ul ref={dashboardRef} className={styles.dropdown}>
            <Link href="/dashboard/students/">
              <li
                className={
                  pathName === "/dashboard/students/"
                    ? `${styles.dropItem} ${styles.activeItem}`
                    : styles.dropItem
                }
              >
                Students
              </li>
            </Link>

            <Link href="/dashboard/teachers/">
              <li
                className={
                  pathName === "/dashboard/teachers/"
                    ? `${styles.dropItem} ${styles.activeItem}`
                    : styles.dropItem
                }
              >
                Teachers
              </li>
            </Link>
          </ul>
        )}
      </div>

      <div className={styles.navItemCon}>
        <div
          className={
            pathName === "/classroom/"
              ? `${styles.navItem} ${styles.activePage}`
              : styles.navItem
          }
          onClick={() =>
            setIsOpen({
              ...isOpen,
              classrooms: !isOpen.classrooms,
            })
          }
        >
          <div className={styles.iconCon}>
            <ClassroomIcon isHere={pathName === "/classroom/"} />
            <p>Classrooms</p>
          </div>

          {isOpen.classrooms ? (
            <ArrowDropUp
              sx={{
                marginLeft: "1rem",
              }}
            />
          ) : (
            <ArrowDropDown
              sx={{
                marginLeft: "1rem",
              }}
            />
          )}
        </div>

        {isOpen.classrooms && (
          <ul ref={classroomRef} className={styles.dropdown}>
            <div
              className={styles.create}
              onClick={() => setOpenClassroomBD(!openClassroomBD)}
            >
              <Add />
              Create Classroom
            </div>
            {classrooms &&
              classrooms.map((classroom: any) => (
                <li
                  onClick={() => navigateClassroom(classroom.id)}
                  key={classroom.id}
                  className={
                    pathName === `/classroom/` && classroomId === classroom.id
                      ? `${styles.dropItem} ${styles.activeItem}`
                      : styles.dropItem
                  }
                >
                  {classroom.name}
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className={styles.navItemCon}>
        <div
          className={
            pathName === "/subject/"
              ? `${styles.navItem} ${styles.activePage}`
              : styles.navItem
          }
          onClick={() =>
            setIsOpen({
              ...isOpen,
              subjects: !isOpen.subjects,
            })
          }
        >
          <div className={styles.iconCon}>
            <SubjectIcon isHere={pathName === "/subjects/"} />
            <p>Subjects</p>
          </div>

          {isOpen.subjects ? (
            <ArrowDropUp
              sx={{
                marginLeft: "1rem",
              }}
            />
          ) : (
            <ArrowDropDown
              sx={{
                marginLeft: "1rem",
              }}
            />
          )}
        </div>

        {isOpen.subjects && (
          <ul ref={subjectRef} className={styles.dropdown}>
            <div
              className={styles.create}
              onClick={() => setOpenSubjectBD(!openSubjectBD)}
            >
              <Add />
              Create Subject
            </div>
            {subjects &&
              subjects.map((subject: any) => (
                <li
                  onClick={() => navigateSubject(subject.id)}
                  key={subject.id}
                  className={
                    pathName === `/subject/` && subjectId === subject.id
                      ? `${styles.dropItem} ${styles.activeItem}`
                      : styles.dropItem
                  }
                >
                  {subject.name}
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className={styles.navItemCon}>
        <div
          className={
            pathName === "/finances/"
              ? `${styles.navItem} ${styles.activePage}`
              : styles.navItem
          }
          onClick={() =>
            setIsOpen({
              ...isOpen,
              finances: !isOpen.finances,
            })
          }
        >
          <div className={styles.iconCon}>
            <EarningIcon isHere={pathName === "/finances/"} />
            <p>Finances</p>
          </div>

          {isOpen.finances ? (
            <ArrowDropUp
              sx={{
                marginLeft: "1rem",
              }}
            />
          ) : (
            <ArrowDropDown
              sx={{
                marginLeft: "1rem",
              }}
            />
          )}
        </div>

        {isOpen.finances && (
          <ul ref={financesRef} className={styles.dropdown}>
            <li
              className={
                pathName === "/finances/paid/"
                  ? `${styles.dropItem} ${styles.activeItem}`
                  : styles.dropItem
              }
            >
              Paid
            </li>
            <li
              className={
                pathName === "/finances/unpaid/"
                  ? `${styles.dropItem} ${styles.activeItem}`
                  : styles.dropItem
              }
            >
              Unpaid
            </li>
          </ul>
        )}
      </div>

      <div className={styles.navItemCon}>
        <div
          className={
            pathName === "/roles/"
              ? `${styles.navItem} ${styles.activePage}`
              : styles.navItem
          }
          onClick={() =>
            setIsOpen({
              ...isOpen,
              roles: !isOpen.roles,
            })
          }
        >
          <div className={styles.iconCon}>
            <RolesIcon isHere={pathName === "/roles/"} />
            <p>Roles</p>
          </div>

          {isOpen.roles ? (
            <ArrowDropUp
              sx={{
                marginLeft: "1rem",
              }}
            />
          ) : (
            <ArrowDropDown
              sx={{
                marginLeft: "1rem",
              }}
            />
          )}
        </div>

        {isOpen.roles && (
          <ul ref={rolesRef} className={styles.dropdown}>
            <li
              onClick={() => router.push("/roles/admin/")}
              className={
                pathName === "/roles/admin/"
                  ? `${styles.dropItem} ${styles.activeItem}`
                  : styles.dropItem
              }
            >
              Admin
            </li>
            <li
              onClick={() => router.push("/roles/class-teacher/")}
              className={
                pathName === "/roles/class-teacher/"
                  ? `${styles.dropItem} ${styles.activeItem}`
                  : styles.dropItem
              }
            >
              Class Teacher
            </li>
            <li
              onClick={() => router.push("/roles/grader/")}
              className={
                pathName === "/roles/grader/"
                  ? `${styles.dropItem} ${styles.activeItem}`
                  : styles.dropItem
              }
            >
              Grader
            </li>
            <li
              onClick={() => router.push("/roles/parent/")}
              className={
                pathName === "/roles/parent/"
                  ? `${styles.dropItem} ${styles.activeItem}`
                  : styles.dropItem
              }
            >
              Parent
            </li>
          </ul>
        )}
      </div>
      <ClassroomBD
        open={openClassroomBD}
        setOpen={setOpenClassroomBD}
        user={user}
      />
      <SubjectBD open={openSubjectBD} setOpen={setOpenSubjectBD} user={user} />
    </>
  );
}

export default NavBar;
