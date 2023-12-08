"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import styles from "./MobileNavBar.module.css";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../firebaseConfig";
import { signOut } from "firebase/auth";

function MobileNavBar() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const dropdownRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      window.location.href = "/";
    });
  };

  const handleClickOutside = (event: any) => {
    if (
      event.target !== dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen]);

  const pathName = usePathname();
  return (
    <div className={styles.main}>
      <div
        className={
          pathName === "/path/"
            ? `${styles.navItem} ${styles.activePage}`
            : styles.navItem
        }
      >
        <Link className={styles.link} href="/path">
          <Image
            src="/directions.svg"
            alt="Rete Logo"
            className={styles.image}
            width={40}
            height={40}
            priority
          />
        </Link>
      </div>

      <div
        className={
          pathName === "/profile/"
            ? `${styles.navItem} ${styles.activePage}`
            : styles.navItem
        }
      >
        <Link className={styles.link} href="/profile">
          <Image
            src="/user.svg"
            alt="Rete Logo"
            className={styles.image}
            width={40}
            height={40}
            priority
          />
        </Link>
      </div>

      <div
        className={
          pathName === "/tasks/"
            ? `${styles.navItem} ${styles.activePage}`
            : styles.navItem
        }
      >
        <Link className={styles.link} href="/tasks">
          <Image
            src="/task.svg"
            alt="Rete Logo"
            className={styles.image}
            width={40}
            height={40}
            priority
          />
        </Link>
      </div>

      <div
        className={
          pathName === "/tips/"
            ? `${styles.navItem} ${styles.activePage}`
            : styles.navItem
        }
      >
        <Link className={styles.link} href="/tips">
          <Image
            src="/tips.svg"
            alt="Rete Logo"
            className={styles.image}
            width={40}
            height={40}
            priority
          />
        </Link>
      </div>

      <div
        className={
          pathName === "/more/"
            ? `${styles.navItem} ${styles.activePage}`
            : styles.navItem
        }
      >
        <Link className={styles.link} href="/more">
          <Image
            src="/three-dots.svg"
            alt="Rete Logo"
            className={styles.image}
            width={40}
            height={40}
            priority
          />
        </Link>
      </div>
    </div>
  );
}

export default MobileNavBar;
