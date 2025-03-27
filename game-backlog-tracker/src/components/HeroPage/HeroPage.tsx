import React from "react";
import styles from "./HeroPage.module.css";
import { Link } from "react-router-dom";


const HeroPage = () => {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.innerHeroContainer}>
        <h1>Heropage</h1>
        <p>Welcome to heropage</p>
        <button><Link to="/auth">Register now!</Link></button>
      </div>
    </section>
  );
};

export default HeroPage;
