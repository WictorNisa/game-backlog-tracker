import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GameCard.module.css";

const GameCard = ({ game, showStatus = true }) => {
  const navigate = useNavigate();

  // Handle card click to navigate to details
  const handleCardClick = () => {
    navigate(`/game/${game.id}`);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "playing":
        return "#4CAF50"; // Green
      case "completed":
        return "#2196F3"; // Blue
      case "backlog":
        return "#FFC107"; // Yellow/Amber
      case "abandoned":
        return "#9E9E9E"; // Gray
      default:
        return "#9E9E9E";
    }
  };

  // Get readable status text
  const getStatusText = (status) => {
    switch (status) {
      case "playing":
        return "Currently Playing";
      case "completed":
        return "Completed";
      case "backlog":
        return "In Backlog";
      case "abandoned":
        return "Abandoned";
      default:
        return "Unknown Status";
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div
        className={styles.cardImage}
        style={{
          backgroundImage: `url(${
            game.image_url ||
            "https://via.placeholder.com/300x180?text=No+Image"
          })`,
        }}
      >
        <div className={styles.overlay}>
          {showStatus && (
            <div
              className={styles.statusBadge}
              style={{ backgroundColor: getStatusColor(game.status) }}
            >
              {getStatusText(game.status)}
            </div>
          )}

          <div className={styles.cardContent}>
            <h3 className={styles.title}>{game.title}</h3>
            <div className={styles.platformInfo}>
              <span className={styles.platform}>{game.platform}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
