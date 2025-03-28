import React from "react";

import styles from "./Home.module.css";
import CurrentlyPlaying from "../../components/CurrentlyPlaying/CurrentlyPlaying";
import AddGame from "../../components/AddGame/AddGame";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
const Home = () => {
  return (
    <section className={styles.homeContainer}>
      <DashboardHeader />
      <CurrentlyPlaying />

      {/* <AddGame /> */}
    </section>
  );
};

export default Home;
