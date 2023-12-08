"use client";
import React, { useState } from "react";
import styles from "./Register.module.css";
import { createSchool } from "../../../api/database";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useRouter } from "next/navigation";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import Loader from "../components/Loader";

function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
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

    createSchool(
      schoolName,
      schoolEmail,
      userCredential.user.uid,
      name.trim(),
      email,
      "",
      password,
      "",
      "admin"
    );

    setAuthLoading(false);
    router.push("/dashboard/students/");
  };

  const handleNext = (e: any) => {
    e.preventDefault();

    // check if all fields are filled in
    if (
      name === "" ||
      email === "" ||
      schoolName === "" ||
      schoolEmail === ""
    ) {
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
      <div className={styles.header}>Register your school</div>

      <form className={styles.body} onSubmit={handleNext}>
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
          <input
            className={styles.input}
            type="text"
            autoCapitalize="words"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="Name of your school"
          />
        </div>

        <div className={styles.inputCon}>
          <input
            className={styles.input}
            type="text"
            value={schoolEmail}
            onChange={(e) => setSchoolEmail(e.target.value)}
            placeholder="Your school's email"
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

        <button className={styles.btn} type="submit" onClick={handleNext}>
          {authLoading ? <Loader /> : "Submit"}
        </button>
      </form>
    </main>
  );
}

export default Signup;
