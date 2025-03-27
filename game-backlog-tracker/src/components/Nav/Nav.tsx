import styles from "./Nav.module.css";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <Link to="/">
        <h1>navbar</h1>
      </Link>
      <ul className={styles.navList}>
        <li className={styles.navItem}>About </li>
        <li className={styles.navItem}>Contact</li>
        <li className={styles.navItem}>
          <Link to="/auth">Sign up</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
