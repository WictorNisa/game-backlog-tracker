import React, { useState } from "react";
import { loginUser } from "../../services/Api/Api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from './LoginForm.module.css'

const LoginForm = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); // Clear previous errors

    // Basic form validation
    if (!userEmail || !userPassword) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const { token, user } = await loginUser({
        userEmail,
        userPassword,
      });

      login(token, {
        id: user.id,
        username: user.username,
        email: user.email,
      });
      // Ensure both token and user are present

      navigate("/home");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <form onSubmit={onSubmitForm} className={styles.loginFormContainer}>
      <label>Email</label>
      <input
        type="email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        required
      />

      <label>Password</label>
      <input
        type="password"
        value={userPassword}
        onChange={(e) => setUserPassword(e.target.value)}
        required
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
