"use client";
import React, { Suspense } from "react";
import styles from "../../layout.module.css";
import Link from "next/link";
import AuthRouteGuard from "../Routing/AuthRouteGuard";
import NavBar from "../NavBar/NavBar";
import { usePathname } from "next/navigation";
import FirstLayout from "./FirstLayout/FirstLayout";
import SecondLayout from "./SecondLayout/SecondLayout";
import ThirdLayout from "./ThirdLayout/ThirdLayout";
import { Provider } from "react-redux";
import store, { persistor } from "../../../../provider/store";
import { PersistGate } from "redux-persist/integration/react";
import { useMediaQuery } from "@mui/material";

const Loading = () => {
  return <div>Loading...</div>;
};

function LayoutWrapper({ children }: any) {
  const pathName = usePathname();
  const isMobile = useMediaQuery("(max-width: 576px)");

  const routes = {
    first: [
      "/",
      "/register/",
      "/welcome/",
      "/signup/",
      "/signin/",
      "/execute/",
    ],
    second: [],
    third: [],
  };

  const checkRoutes = () => {
    if (routes.first.includes(pathName)) {
      return 1;
    }

    //if (isMobile) return 1;

    return 2;
  };

  return (
    <Suspense fallback={<Loading />}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthRouteGuard>
            <div className={styles.container}>
              {checkRoutes() === 1 && (
                <FirstLayout
                  children={children}
                  isMobile={isMobile}
                  authPages={routes.first}
                />
              )}
              {checkRoutes() === 2 && <SecondLayout children={children} />}
            </div>
          </AuthRouteGuard>
        </PersistGate>
      </Provider>
    </Suspense>
  );
}

export default LayoutWrapper;
