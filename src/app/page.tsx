"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useMediaQuery } from "@mui/material";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 576px)");

  return (
    <main className={styles.main}>
      <div className={styles.logo}>
        <Link href="/path">
          <Image
            src="/logo.png"
            alt="Rete Logo"
            width={isMobile ? 150 : 180}
            height={isMobile ? 20 : 40}
            priority
          />
        </Link>
      </div>
      <div className={styles.container}>
        <div className={styles.body}>
          <div className={styles.bigText}>
            Empowering Education: Your All-in-One School Management Solution.
          </div>
          <Link className={styles.wrapper} href="/register">
            <button className={styles.getStarted}>GET STARTED</button>
          </Link>
          <Link className={styles.wrapper} href="/signin">
            <button className={styles.login}>I ALREADY HAVE AN ACCOUNT</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
