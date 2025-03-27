import React, { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import SignupForm from "../../components/SignupForm/SignupForm";
import styles from "./Auth.module.css";

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0MjkwMzE4MywiZXhwIjoxNzQyOTA2NzgzfQ.qFupYG_3lXDbf3BariWz_sCgYv40r8eEqrOYwKpz_iQ JWT SECRET TOKEN
const Auth = () => {
  const [newUser, setNewUser] = useState(true);

  const handleButtonClick = () => {
    setNewUser(!newUser);
  };

  return (
    <section className={styles.authContainer}>
      <div className={styles.imageContainer}></div>
      <div className={styles.formContainer}>
        {newUser ? <SignupForm /> : <LoginForm />}
        {newUser ? (
          <p>
            Already a user?{" "}
            <span>
              <button onClick={handleButtonClick}>login instead</button>
            </span>
          </p>
        ) : (
          <p>
            Dont have a account?{" "}
            <span>
              <button onClick={handleButtonClick}>login instead</button>
            </span>
          </p>
        )}
      </div>
    </section>
  );
};

export default Auth;
