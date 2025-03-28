// src/components/AddGame/AddGame.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddGame.module.css";
import { useGameLibrary } from "../../context/GameLibraryContext";
import GameSearch from "../GameSearch/GameSearch";
import { fetchFromRAWG } from "../../services/Api/Api";

const AddGame = () => {
  const navigate = useNavigate();
  const { refreshLibrary } = useGameLibrary();
  const API_BASE_URL = "http://localhost:3000";

  // Track whether we're in search mode or form mode
  const [searchMode, setSearchMode] = useState(true);

  // Selected game from search
  const [selectedGame, setSelectedGame] = useState(null);

  // Form state - we'll populate this from the API when a game is selected
  const [formData, setFormData] = useState({
    title: "",
    platform: "",
    genre: "",
    publisher: "",
    releaseDate: "",
    status: "backlog", // Default status
    imageUrl: "",
    description: "",
    notes: "",
  });

  // Validation and UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle game selection from search results
  const handleGameSelect = async (game) => {
    try {
      // Fetch detailed information about the game
      const gameDetails = await fetchFromRAWG(`/games/${game.id}`);

      // Extract platforms and format them as a string
      const platforms = gameDetails.platforms
        ? gameDetails.platforms.map((p) => p.platform.name).join(", ")
        : "";

      // Extract genres
      const genres = gameDetails.genres
        ? gameDetails.genres.map((g) => g.name).join(", ")
        : "";

      // Extract publisher
      const publisher =
        gameDetails.publishers && gameDetails.publishers.length > 0
          ? gameDetails.publishers[0].name
          : "";

      // Update form data with game details
      setFormData({
        title: gameDetails.name || "",
        platform: platforms,
        genre: genres,
        publisher: publisher,
        releaseDate: gameDetails.released || "",
        status: "backlog", // Default status
        imageUrl: gameDetails.background_image || "",
        description: gameDetails.description_raw || "",
        notes: "",
      });

      setSelectedGame(gameDetails);
      setSearchMode(false);
    } catch (error) {
      console.error("Error fetching game details:", error);
      setSubmitError("Failed to load game details. Please try again.");
    }
  };

  // Switch back to search mode
  const handleBackToSearch = () => {
    setSearchMode(true);
    setSelectedGame(null);
    setSubmitError("");
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // We only need to validate status and notes since the rest comes from the API
    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset submission states
    setSubmitError("");
    setSubmitSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get token for authentication
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You must be logged in to add a game");
      }

      // First, check if the game already exists or create it
      const gameResponse = await fetch(`${API_BASE_URL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          platform: formData.platform,
          genre: formData.genre,
          publisher: formData.publisher,
          release_date: formData.releaseDate,
          image_url: formData.imageUrl,
          description: formData.description,
          rawg_id: selectedGame.id, // Store the RAWG ID for future reference
        }),
      });

      if (!gameResponse.ok) {
        const errorData = await gameResponse.json();
        throw new Error(errorData.error || "Failed to add game");
      }

      const gameData = await gameResponse.json();

      // Then add the game to the user's library
      const libraryResponse = await fetch(`${API_BASE_URL}/library`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          game_id: gameData.id,
          status: formData.status,
          notes: formData.notes,
        }),
      });

      if (!libraryResponse.ok) {
        const errorData = await libraryResponse.json();
        throw new Error(errorData.error || "Failed to add game to library");
      }

      // Success! Show success message and reset form
      setSubmitSuccess(true);
      setFormData({
        title: "",
        platform: "",
        genre: "",
        publisher: "",
        releaseDate: "",
        status: "backlog",
        imageUrl: "",
        description: "",
        notes: "",
      });
      setSelectedGame(null);
      setSearchMode(true);

      // Refresh the game library context
      await refreshLibrary();

      // Redirect after short delay
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      setSubmitError(
        error.message || "An error occurred while adding the game"
      );
      console.error("Error adding game:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Add Game to Library</h2>

      {submitSuccess && (
        <div className={styles.successMessage}>
          Game successfully added to your library!
        </div>
      )}

      {submitError && <div className={styles.errorMessage}>{submitError}</div>}

      {searchMode ? (
        // Search mode - show the search component
        <div className={styles.searchMode}>
          <p>Search for a game to add to your library:</p>
          <GameSearch onGameSelect={handleGameSelect} />

          <div className={styles.orDivider}>
            <span>OR</span>
          </div>

          <button
            className={styles.manualEntryButton}
            onClick={() => setSearchMode(false)}
          >
            Add Game Manually
          </button>
        </div>
      ) : (
        // Form mode - show the form with game details
        <form onSubmit={handleSubmit} className={styles.gameForm}>
          {/* Display selected game image if available */}
          {formData.imageUrl && (
            <div className={styles.selectedGameImage}>
              <img src={formData.imageUrl} alt={formData.title} />
            </div>
          )}

          {/* Title field - readonly since it comes from API */}
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              readOnly
              className={styles.readonlyField}
            />
          </div>

          {/* Platform field - readonly */}
          <div className={styles.formGroup}>
            <label htmlFor="platform">Platform</label>
            <input
              type="text"
              id="platform"
              name="platform"
              value={formData.platform}
              readOnly
              className={styles.readonlyField}
            />
          </div>

          {/* Other readonly fields from API */}
          <div className={styles.formGroup}>
            <label htmlFor="genre">Genre</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              readOnly
              className={styles.readonlyField}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="publisher">Publisher</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              readOnly
              className={styles.readonlyField}
            />
          </div>

          {/* Status field - user can edit this */}
          <div className={styles.formGroup}>
            <label htmlFor="status">Status*</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={errors.status ? styles.inputError : ""}
            >
              <option value="backlog">Backlog</option>
              <option value="playing">Currently Playing</option>
              <option value="completed">Completed</option>
              <option value="abandoned">Abandoned</option>
            </select>
            {errors.status && (
              <div className={styles.errorText}>{errors.status}</div>
            )}
          </div>

          {/* Notes field - user can edit this */}
          <div className={styles.formGroup}>
            <label htmlFor="notes">Personal Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Your thoughts, progress, or reminders about this game..."
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleBackToSearch}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Back to Search
            </button>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add to Library"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddGame;
