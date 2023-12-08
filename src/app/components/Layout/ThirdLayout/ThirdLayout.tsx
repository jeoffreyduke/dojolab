import React from "react";
import NavBar from "../../NavBar/NavBar";
import RightBar from "../../RightBar/RightBar";
import AuthRouteGuard from "../../Routing/AuthRouteGuard";
import styles from "./ThirdLayout.module.css";

const ThirdLayout = ({ children }: any) => {
  return (
    <>
      <nav className={styles.nav}>
        <NavBar />
      </nav>
      <main className={styles.main}>{children}</main>
      <section className={styles.right}>
        <RightBar />
      </section>
    </>
  );
};

export default ThirdLayout;
