import React from "react";
import AuthRouteGuard from "../../Routing/AuthRouteGuard";
import styles from "./FirstLayout.module.css";
import MobileNavBar from "../../MobileNavBar/MobileNavBar";
import { usePathname } from "next/navigation";

const FirstLayout = ({ children, isMobile, authPages }: any) => {
  const pathName = usePathname();

  const check = () => {
    if (authPages.includes(pathName)) {
      return false;
    }

    return true;
  };

  return (
    <>
      <main className={styles.main}>{children}</main>
      {isMobile && check() && <MobileNavBar />}
    </>
  );
};

export default FirstLayout;
