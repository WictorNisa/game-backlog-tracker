import React, { useEffect, useState } from "react";
import { signUpuser } from "../../services/Api/Api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./SignupForm.module.css";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Send data to database through API
    const userData = {
      userName: username,
      userEmail: userEmail,
      userPassword: userPassword,
    };
    try {
      const res = await signUpuser(userData);

      if (res.token) {
        login(res.token, res.username);
        navigate("/home");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  return (
    <form onSubmit={onSubmitForm} className={styles.signUpFormContainer}>
      <label>Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter a username"
      />

      <label>Email</label>
      <input
        type="email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
      />

      <label>Password</label>
      <input
        type="password"
        value={userPassword}
        onChange={(e) => setUserPassword(e.target.value)}
      />

      <button type="submit">Sign up</button>
    </form>
  );
};

export default SignupForm;
