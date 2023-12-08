"use client";
import React from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";

interface Props {
  placeholderPart: string;
}

function Header({ placeholderPart }: Props) {
  const isMobile = useMediaQuery("(max-width: 576px)");

  return (
    <div className={styles.container}>
      <input
        type="search"
        placeholder={`Search ${placeholderPart}`}
        className={styles.search}
      />

      <div className={styles.logo}>
        <Link href="/path">
          <Image
            src="/logo.png"
            alt="Rete Logo"
            width={isMobile ? 100 : 145}
            height={isMobile ? 10 : 30}
            priority
          />
        </Link>
      </div>
    </div>
  );
}

export default Header;
