import React from "react";
import NavBar from "../../NavBar/NavBar";
import styles from "./SecondLayout.module.css";

const SecondLayout = ({ children }: any) => {
  return (
    <>
      <nav className={styles.nav}>
        <NavBar />
      </nav>
      <section className={styles.body}>
        <main className={styles.main}>{children}</main>
      </section>
    </>
  );
};

export default SecondLayout;
