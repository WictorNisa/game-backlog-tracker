import { useAuth } from "../../context/AuthContext";
import styles from "./Nav.module.css";
import { Link } from "react-router-dom";

const Nav = () => {
  const { user } = useAuth();
  return (
    <nav className={styles.nav}>
      <Link to="/">
        <h1>Game Tracker</h1>
      </Link>
      <ul className={styles.navList}>
        <li className={styles.navItem}>About </li>
        <li className={styles.navItem}>Contact</li>
        <li className={styles.navItem}>
          {user ? (
            <Link to="/home">Dashboard</Link>
          ) : (
            <Link to="/auth">Sign up</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
