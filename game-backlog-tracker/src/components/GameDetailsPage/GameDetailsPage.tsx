import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameLibrary } from '../../context/GameLibraryContext';
import styles from './GameDetailsPage.module.css';

const GameDetailsPage = () => {
  const { id } = useParams();
  const { games, loading, error, refreshLibrary } = useGameLibrary();
  const navigate = useNavigate();
  
  // States for editable fields
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  
  // Find the specific game in the library
  const game = games.find(g => g.id === parseInt(id));
  
  // Set initial values when game data loads
  useEffect(() => {
    if (game) {
      setNotes(game.notes || '');
      setSelectedStatus(game.status || 'backlog');
    }
  }, [game]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'playing': return '#4CAF50'; // Green
      case 'completed': return '#2196F3'; // Blue
      case 'backlog': return '#FFC107'; // Yellow/Amber
      case 'abandoned': return '#9E9E9E'; // Gray
      default: return '#9E9E9E';
    }
  };
  
  // Get readable status text
  const getStatusText = (status) => {
    switch (status) {
      case 'playing': return 'Currently Playing';
      case 'completed': return 'Completed';
      case 'backlog': return 'In Backlog';
      case 'abandoned': return 'Abandoned';
      default: return 'Unknown Status';
    }
  };
  
  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (newStatus === selectedStatus) return;
    
    setIsUpdating(true);
    setUpdateError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`http://localhost:3000/library/${game.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update game status');
      }
      
      setSelectedStatus(newStatus);
      await refreshLibrary();
    } catch (err) {
      setUpdateError(err.message || 'Error updating status');
      console.error('Status update error:', err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle notes save
  const handleSaveNotes = async () => {
    setIsUpdating(true);
    setUpdateError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`http://localhost:3000/library/${game.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update notes');
      }
      
      setEditingNotes(false);
      await refreshLibrary();
    } catch (err) {
      setUpdateError(err.message || 'Error saving notes');
      console.error('Notes update error:', err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle removing game from library
  const handleRemoveGame = async () => {
    if (!window.confirm('Are you sure you want to remove this game from your library?')) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`http://localhost:3000/library/${game.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove game');
      }
      
      await refreshLibrary();
      navigate('/library');
    } catch (err) {
      setUpdateError(err.message || 'Error removing game');
      console.error('Remove game error:', err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle loading and error states
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading game details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Game</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/library')}
          className={styles.backButton}
        >
          Back to Library
        </button>
      </div>
    );
  }
  
  if (!game) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Game Not Found</h2>
        <p>This game may have been removed from your library or doesn't exist.</p>
        <button 
          onClick={() => navigate('/library')}
          className={styles.backButton}
        >
          Back to Library
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.detailsContainer}>
      {/* Game header with image and title */}
      <div className={styles.gameHeader}>
        <div 
          className={styles.gameCover}
          style={{ 
            backgroundImage: `url(${game.image_url || 'https://via.placeholder.com/300x400?text=No+Image'})` 
          }}
        ></div>
        
        <div className={styles.gameTitleSection}>
          <h1 className={styles.gameTitle}>{game.title}</h1>
          
          <div className={styles.platformGenre}>
            <span className={styles.platform}>{game.platform}</span>
            {game.genre && (
              <>
                <span className={styles.separator}>•</span>
                <span className={styles.genre}>{game.genre}</span>
              </>
            )}
          </div>
          
          {game.publisher && (
            <div className={styles.publisher}>
              <span>Publisher: {game.publisher}</span>
            </div>
          )}
          
          <div 
            className={styles.statusBadge}
            style={{ backgroundColor: getStatusColor(selectedStatus) }}
          >
            {getStatusText(selectedStatus)}
          </div>
        </div>
      </div>
      
      {/* Game status and tracking info */}
      <div className={styles.gameTracking}>
        <h2>Game Progress</h2>
        
        <div className={styles.trackingGrid}>
          <div className={styles.trackingItem}>
            <span className={styles.trackingLabel}>Status:</span>
            <div className={styles.statusSelector}>
              {['playing', 'completed', 'backlog', 'abandoned'].map(status => (
                <button 
                  key={status}
                  className={`${styles.statusButton} ${selectedStatus === status ? styles.activeStatus : ''}`}
                  style={{ 
                    borderColor: getStatusColor(status),
                    backgroundColor: selectedStatus === status ? getStatusColor(status) : 'transparent',
                    color: selectedStatus === status ? 'white' : getStatusColor(status)
                  }}
                  onClick={() => handleStatusChange(status)}
                  disabled={isUpdating}
                >
                  {getStatusText(status)}
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.trackingItem}>
            <span className={styles.trackingLabel}>Started:</span>
            <span>{formatDate(game.start_date)}</span>
          </div>
          
          <div className={styles.trackingItem}>
            <span className={styles.trackingLabel}>Completed:</span>
            <span>{formatDate(game.completion_date)}</span>
          </div>
        </div>
      </div>
      
      {/* Game description */}
      {game.description && (
        <div className={styles.descriptionSection}>
          <h2>Description</h2>
          <div className={styles.description}>
            {game.description}
          </div>
        </div>
      )}
      
      {/* Notes section */}
      <div className={styles.notesSection}>
        <div className={styles.notesSectionHeader}>
          <h2>My Notes</h2>
          {!editingNotes && (
            <button 
              className={styles.editButton}
              onClick={() => setEditingNotes(true)}
              disabled={isUpdating}
            >
              Edit Notes
            </button>
          )}
        </div>
        
        {editingNotes ? (
          <div className={styles.notesEditor}>
            <textarea
              className={styles.notesTextarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Write your thoughts, progress, or reminders about this game..."
            ></textarea>
            
            <div className={styles.notesActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => {
                  setEditingNotes(false);
                  setNotes(game.notes || '');
                }}
                disabled={isUpdating}
              >
                Cancel
              </button>
              
              <button 
                className={styles.saveButton}
                onClick={handleSaveNotes}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.notesContent}>
            {notes ? (
              <p>{notes}</p>
            ) : (
              <p className={styles.emptyNotes}>No notes added yet. Click "Edit Notes" to add your thoughts about this game.</p>
            )}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {updateError && (
        <div className={styles.updateError}>
          {updateError}
        </div>
      )}
      
      {/* Footer actions */}
      <div className={styles.footerActions}>
        <button 
          className={styles.backToLibraryButton}
          onClick={() => navigate('/library')}
        >
          Back to Library
        </button>
        
        <button 
          className={styles.removeButton}
          onClick={handleRemoveGame}
          disabled={isUpdating}
        >
          Remove from Library
        </button>
      </div>
    </div>
  );
};

export default GameDetailsPage;