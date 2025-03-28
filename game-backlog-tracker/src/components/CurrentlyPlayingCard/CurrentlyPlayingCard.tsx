import React from 'react';
import styles from "./CurrentlyPlayingCard.module.css";

const CurrentlyPlayingCard = ({ game }) => {
  // Extract information with fallbacks for missing data
  const { 
    title = "Unknown Game", 
    platform = "Unknown Platform",
    image_url,
    status = "playing",
    notes,
    // Assuming you might track progress in the future
    progress = Math.floor(Math.random() * 100) // Just for demo purposes
  } = game;
  
  // Format the platform string if it's an array
  const platformString = Array.isArray(platform) ? platform.join(', ') : platform;
  
  return (
    <div className={styles.card}>
      <div 
        className={styles.cardImage}
        style={{ 
          backgroundImage: `url(${image_url || 'https://via.placeholder.com/300x180?text=No+Image'})` 
        }}
      >
        <div className={styles.overlay}>
          <div className={styles.statusBadge}>
            Currently Playing
          </div>
          
          <div className={styles.cardContent}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.platformInfo}>
              <span className={styles.platform}>{platformString}</span>
            </div>
            
            {/* Progress bar */}
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className={styles.progressText}>{progress}% complete</span>
            </div>
            
            {/* Notes preview (if available) */}
            {notes && (
              <div className={styles.notes}>
                <p>{notes.length > 60 ? `${notes.substring(0, 60)}...` : notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentlyPlayingCard;