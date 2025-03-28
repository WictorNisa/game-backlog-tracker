// src/components/DashboardHeader/DashboardHeader.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./DashboardHeader.module.css";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Determine active navigation item
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }
  
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <Link to="/" className={styles.logo}>
          GameTracker
        </Link>
      </div>
      
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link 
              to="/" 
              className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link 
              to="/library" 
              className={`${styles.navLink} ${isActive('/library') ? styles.active : ''}`}
            >
              My Library
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link 
              to="/addgame" 
              className={`${styles.navLink} ${isActive('/addgame') ? styles.active : ''}`}
            >
              Add Game
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className={styles.userSection}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className={styles.username}>{user.username}</span>
        </div>
        
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;