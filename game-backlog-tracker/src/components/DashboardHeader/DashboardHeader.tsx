import React from "react";
import styles from "./DashboardHeader.module.css";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.dashboardHeader}>
      {/* <h1>Welcome, {user.username}!</h1>
      <p>User profile</p> */}
      <ul className={styles.dashboardNavList}>
        <li>
          <Link to="/addgame">Add a game</Link>
        </li>
        <li>My library</li>
        <li>My Reviews</li>
      </ul>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default DashboardHeader;
