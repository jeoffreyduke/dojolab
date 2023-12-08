"use client";
import React, { useState } from "react";
import styles from "./Signup.module.css";
import { createUser, deleteeRoleInvite } from "../../../api/database";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Player } from "@lottiefiles/react-lottie-player";
import Loader from "../components/Loader";
import { doc, query, where } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

function Signup() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolId");
  const inviteId = searchParams.get("inviteId");

  const inviteRef: any = inviteId && doc(db, "invites", inviteId);

  const [invite, loading] = useDocumentData(inviteRef);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const signUpWithGoogle = () => {
    setAuthLoading(true);

    try {
      // Create a Google Auth provider object.
      const googleAuthProvider = new GoogleAuthProvider();

      // Redirect the user to the home page.
      window.location.href = "/";
    } catch (error) {
      // Handle error.
    }

    setAuthLoading(false);
  };

  const signUpWithEmail = async () => {
    setAuthLoading(true);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (invite) {
      createUser(
        userCredential.user.uid,
        invite.schoolId,
        name.trim(),
        email,
        "",
        password,
        "",
        invite.role
      );

      setAuthLoading(false);
      deleteeRoleInvite(invite.id);
      window.location.href = "/dashboard/students/";
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // check if all fields are filled in
    if (name === "" || email === "") {
      setError("Please fill in all fields");
      console.log(error);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    signUpWithEmail();
  };

  return (
    <main className={styles.main}>
      {loading ? (
        <></>
      ) : invite ? (
        <>
          <div className={styles.header}>Create your profile</div>

          <form className={styles.body} onSubmit={handleSubmit}>
            <div className={styles.inputCon}>
              <input
                className={styles.input}
                type="text"
                autoCapitalize="words"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>

            <div className={styles.inputCon}>
              <input
                className={styles.input}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>

            <div className={styles.inputCon}>
              <div className={styles.password}>
                <input
                  className={styles.passwordInput}
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />

                <div
                  className={styles.eyeContainer}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <VisibilityOffOutlined className={styles.eye} />
                  ) : (
                    <VisibilityOutlined className={styles.eye} />
                  )}
                </div>
              </div>
            </div>

            <div className={styles.err}>{error}</div>

            <button className={styles.btn} type="submit" onClick={handleSubmit}>
              {authLoading ? <Loader /> : "Submit"}
            </button>
          </form>
        </>
      ) : (
        <div className={styles.header}>
          Invite has been expended or does not exist.
        </div>
      )}
    </main>
  );
}

export default Signup;
