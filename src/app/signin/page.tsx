"use client";
import React, { useState } from "react";
import styles from "./Signin.module.css";
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../../firebaseConfig";
import { AuthErrorCodes, signInWithEmailAndPassword } from "firebase/auth";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import Loader from "../components/Loader";

function Signin() {
  const [authLoading, setAuthLoading] = useState(false);

  const usersRef = collection(db, "users");
  const [users] = useCollectionData(usersRef);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const loginEmailPassword = async () => {
    try {
      setAuthLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/path/";
      setAuthLoading(false);
    } catch (error: any) {
      switch (error.code) {
        case AuthErrorCodes.INVALID_EMAIL:
          setAuthLoading(false);
          setError("Invalid email");
          break;
        case AuthErrorCodes.USER_DELETED:
          setAuthLoading(false);
          setError("User not found");
          break;
        case AuthErrorCodes.INVALID_PASSWORD:
          setAuthLoading(false);
          setError("Wrong password");
          break;
        default:
          setAuthLoading(false);
          setError("Something went wrong");
      }
    }
  };

  const handleLogin = (e: any) => {
    e.preventDefault();

    if (password === "" || email === "") {
      setError("Please fill in all fields");
      return;
    }

    if (users) {
      for (const user of users) {
        if (user?.email === email && user?.password === password) {
          setError("");
          loginEmailPassword();
          break;
        } else if (user?.email === email && user?.password !== password) {
          setError("Wrong password, please try again");
        } else if (user?.email !== email && user?.password === password) {
          setError("Your email does not seem to be correct");
        } else {
          setError("Incorrect credentials, please try again");
        }
      }
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>Sign in</div>

      <form className={styles.body} onSubmit={handleLogin}>
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

        <button className={styles.btn} type="submit" onClick={handleLogin}>
          {authLoading ? <Loader /> : "Submit"}
        </button>
      </form>
    </main>
  );
}

export default Signin;
