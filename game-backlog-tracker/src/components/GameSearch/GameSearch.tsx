// src/components/GameSearch/GameSearch.jsx
import React, { useState, useEffect } from 'react';
import styles from './GameSearch.module.css';
import { fetchFromRAWG } from '../../services/Api/Api';

const GameSearch = ({ onGameSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Debounce search to avoid making too many API calls
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) {
      setSearchResults([]);
      return;
    }
    
    const searchTimer = setTimeout(() => {
      searchGames(searchTerm);
    }, 500); // Wait 500ms after user stops typing
    
    return () => clearTimeout(searchTimer);
  }, [searchTerm]);
  
  const searchGames = async (query) => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await fetchFromRAWG('/games', {
        search: query,
        page_size: 6 // Limit results to 6 games
      });
      
      setSearchResults(data.results);
    } catch (err) {
      console.error('Error searching games:', err);
      setError('Failed to search games. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputWrapper}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search for a game..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isLoading && <div className={styles.spinner}></div>}
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {searchResults.length > 0 && (
        <div className={styles.resultsContainer}>
          {searchResults.map(game => (
            <div 
              key={game.id} 
              className={styles.gameResult}
              onClick={() => onGameSelect(game)}
            >
              {game.background_image && (
                <img 
                  src={game.background_image} 
                  alt={game.name} 
                  className={styles.gameThumbnail}
                />
              )}
              <div className={styles.gameInfo}>
                <h3>{game.name}</h3>
                <div className={styles.gameMeta}>
                  <span>{game.released ? new Date(game.released).getFullYear() : 'Unknown'}</span>
                  {game.platforms && (
                    <span>
                      {game.platforms
                        .slice(0, 3)
                        .map(p => p.platform.name)
                        .join(', ')}
                      {game.platforms.length > 3 ? '...' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameSearch;