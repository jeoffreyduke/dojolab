"use client";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "../../../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

interface AuthRouteGuardProps {
  children: ReactNode;
}

const AuthRouteGuard: React.FC<AuthRouteGuardProps> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    console.log(pathName);
    if (!pathName.includes("signup/")) {
      if (!loading) {
        if (user) {
          router.push("/dashboard/students/");
        } else router.push("/");
      }
    }
  }, [user, loading]);

  return <>{children}</>;
};

export default AuthRouteGuard;
