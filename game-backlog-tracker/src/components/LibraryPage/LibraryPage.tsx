// src/components/Library/LibraryPage.jsx
import React, { useState } from "react";
import { useGameLibrary } from "../../context/GameLibraryContext";
import styles from "./LibraryPage.module.css";
import GameCard from "../GameCard/GameCard";

const LibraryPage = () => {
  const { games, loading, error } = useGameLibrary();

  // State for filters and sorting
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("title");

  // If still loading games
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        Loading your game library...
      </div>
    );
  }

  // If error occurred
  if (error) {
    return (
      <div className={styles.errorContainer}>
        Error loading library: {error}
      </div>
    );
  }

  // Filter games based on selected status
  const filteredGames =
    statusFilter === "all"
      ? games
      : games.filter((game) => game.status === statusFilter);

  // Sort games based on selected sort option
  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "platform") {
      return a.platform.localeCompare(b.platform);
    }
    return 0;
  });

  // Handle empty library state
  if (games.length === 0) {
    return (
      <div className={styles.emptyLibrary}>
        <h2>Your game library is empty</h2>
        <p>Add some games to start tracking your collection!</p>
      </div>
    );
  }

  // Handle filtered results being empty
  if (filteredGames.length === 0) {
    return (
      <div className={styles.libraryContainer}>
        <div className={styles.filterControls}>
          <h2>Game Library</h2>
          <div className={styles.filters}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Games</option>
              <option value="playing">Currently Playing</option>
              <option value="completed">Completed</option>
              <option value="backlog">Backlog</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>
        </div>
        <div className={styles.emptyResults}>
          <p>No games found with the selected filter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.filterControls}>
        <h2>Game Library</h2>
        <div className={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Games</option>
            <option value="playing">Currently Playing</option>
            <option value="completed">Completed</option>
            <option value="backlog">Backlog</option>
            <option value="abandoned">Abandoned</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="title">Sort by Title</option>
            <option value="platform">Sort by Platform</option>
            <option value="recent">Sort by Recently Added</option>
          </select>
        </div>
      </div>

      <div className={styles.gameCount}>
        Showing {filteredGames.length}{" "}
        {filteredGames.length === 1 ? "game" : "games"}
      </div>

      <div className={styles.gameGrid}>
        {sortedGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            showStatus={statusFilter === "all"}
          />
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;
