import React from 'react';
import { useGameLibrary } from '../../context/GameLibraryContext';
import styles from "./CurrentlyPlaying.module.css";
import CurrentlyPlayingCard from '../CurrentlyPlayingCard/CurrentlyPlayingCard';

const CurrentlyPlaying = () => {
  const { getCurrentlyPlaying, loading, error } = useGameLibrary();
  
  // Get currently playing games and limit to 4
  const currentGames = getCurrentlyPlaying().slice(0, 4);
  
  if (loading) {
    return <div className={styles.currentGameContainer}>Loading games...</div>;
  }
  
  if (error) {
    return <div className={styles.currentGameContainer}>Error: {error}</div>;
  }
  
  if (currentGames.length === 0) {
    return (
      <div className={styles.currentGameContainer}>
        <p>You're not currently playing any games.</p>
        <button className={styles.addGameButton}>Start playing a game</button>
      </div>
    );
  }
  
  return (
    <div className={styles.currentGameContainer}>
      <h2 className={styles.sectionTitle}>Currently Playing</h2>
      <div className={styles.gameGrid}>
        {currentGames.map(game => (
          <CurrentlyPlayingCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default CurrentlyPlaying;