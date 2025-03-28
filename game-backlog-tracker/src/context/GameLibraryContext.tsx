// src/context/GameLibraryContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of a game object
interface Game {
  id: number;
  title: string;
  platform: string;
  genre?: string;
  publisher?: string;
  image_url?: string;
  description?: string;
  status: "playing" | "completed" | "backlog" | "abandoned";
  start_date?: string;
  completion_date?: string;
  notes?: string;
}

// Define what our context will provide
interface GameLibraryContextType {
  games: Game[];
  loading: boolean;
  error: string | null;
  refreshLibrary: () => Promise<void>;
  updateGameStatus: (
    gameId: number,
    newStatus: Game["status"]
  ) => Promise<void>;
  getCurrentlyPlaying: () => Game[];
  getBacklog: () => Game[];
  getCompleted: () => Game[];
}

// Create the context with a default value
const GameLibraryContext = createContext<GameLibraryContextType | undefined>(
  undefined
);

// Provider component that wraps your app and makes the context available
export function GameLibraryProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch the game library
  const fetchLibrary = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:3000/library", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setGames(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching game library:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch games when the component mounts
  useEffect(() => {
    fetchLibrary();
  }, []);

  // Function to refresh the library data
  const refreshLibrary = async () => {
    await fetchLibrary();
  };

  // Function to update a game's status
  const updateGameStatus = async (
    gameId: number,
    newStatus: Game["status"]
  ) => {
    try {
      // Optimistic update - update the UI immediately
      setGames((prevGames) =>
        prevGames.map((game) =>
          game.id === gameId ? { ...game, status: newStatus } : game
        )
      );

      // Send the update to the server
      const response = await fetch(`http://localhost:3000/library/${gameId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update game status");
      }

      await refreshLibrary();
    } catch (err) {
      // If there's an error, revert our optimistic update
      setError(
        err instanceof Error ? err.message : "Failed to update game status"
      );
      await refreshLibrary(); // Refresh to get the correct state
    }
  };

  // Helper functions for filtering games
  const getCurrentlyPlaying = () =>
    games.filter((game) => game.status === "playing");
  const getBacklog = () => games.filter((game) => game.status === "backlog");
  const getCompleted = () =>
    games.filter((game) => game.status === "completed");

  // Create the value object that will be provided to consumers
  const contextValue: GameLibraryContextType = {
    games,
    loading,
    error,
    refreshLibrary,
    updateGameStatus,
    getCurrentlyPlaying,
    getBacklog,
    getCompleted,
  };

  // Return the provider with the value
  return (
    <GameLibraryContext.Provider value={contextValue}>
      {children}
    </GameLibraryContext.Provider>
  );
}

// Custom hook to use the game library context
export function useGameLibrary() {
  const context = useContext(GameLibraryContext);

  if (context === undefined) {
    throw new Error("useGameLibrary must be used within a GameLibraryProvider");
  }

  return context;
}
