// src/pages/Home/Home.jsx
import React from "react";
import { useGameLibrary } from "../../context/GameLibraryContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import CurrentlyPlaying from "../../components/CurrentlyPlaying/CurrentlyPlaying";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import styles from "./Home.module.css";

const Home = () => {
  const { user } = useAuth();
  const { 
    games, 
    getCompleted, 
    getBacklog, 
    getCurrentlyPlaying, 
    loading, 
    error 
  } = useGameLibrary();
  
  // Get stats for the user's library
  const completedGames = getCompleted();
  const backlogGames = getBacklog();
  const playingGames = getCurrentlyPlaying();
  
  // Calculate completion percentage
  const completionPercentage = games.length > 0 
    ? Math.round((completedGames.length / games.length) * 100) 
    : 0;
  
  // Get most recent games (across all statuses)
  const recentGames = [...games]
    .sort((a, b) => new Date(b.updated_at || b.added_at) - new Date(a.updated_at || a.added_at))
    .slice(0, 5);
    
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading your gaming dashboard...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeader />
      
      {/* Hero section with welcome message */}
      <section className={styles.heroSection}>
        <div className={styles.welcomeMessage}>
          <h1>Welcome back, {user?.username || 'Gamer'}</h1>
          <p>Track, discover, and conquer your game collection</p>
        </div>
        
        {/* Quick stats cards */}
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{games.length}</div>
            <div className={styles.statLabel}>Games in Library</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statValue}>{playingGames.length}</div>
            <div className={styles.statLabel}>Currently Playing</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statValue}>{completedGames.length}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statValue}>{completionPercentage}%</div>
            <div className={styles.statLabel}>Completion Rate</div>
          </div>
        </div>
      </section>
      
      {/* Currently playing section */}
      <section className={styles.dashboardSection}>
        <CurrentlyPlaying />
      </section>
      
      {/* Backlog section */}
      <section className={styles.dashboardSection}>
        <div className={styles.sectionHeader}>
          <h2>Your Backlog</h2>
          <Link to="/library?status=backlog" className={styles.viewAllLink}>
            View All
          </Link>
        </div>
        
        {backlogGames.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Your backlog is empty. Add games to your backlog to track what you want to play next.</p>
            <Link to="/addgame" className={styles.addGameButton}>
              Add Games
            </Link>
          </div>
        ) : (
          <div className={styles.backlogStats}>
            <div className={styles.backlogChart}>
              <div 
                className={styles.backlogChartFill} 
                style={{ width: `${completionPercentage}%` }}
              />
              <div className={styles.backlogChartText}>
                <strong>{completedGames.length}</strong> of <strong>{games.length}</strong> games completed
              </div>
            </div>
            <div className={styles.backlogInfo}>
              <p>You have <strong>{backlogGames.length}</strong> games in your backlog.</p>
              <Link to="/library?status=backlog" className={styles.manageBacklogLink}>
                Manage Backlog
              </Link>
            </div>
          </div>
        )}
      </section>
      
      {/* Recent activity section */}
      <section className={styles.dashboardSection}>
        <div className={styles.sectionHeader}>
          <h2>Recent Activity</h2>
        </div>
        
        {recentGames.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No recent activity. Start adding games to your library to track your progress.</p>
          </div>
        ) : (
          <ul className={styles.activityList}>
            {recentGames.map(game => (
              <li key={game.id} className={styles.activityItem}>
                <Link to={`/games/${game.id}`} className={styles.activityLink}>
                  <div 
                    className={styles.activityGameImage} 
                    style={{ backgroundImage: `url(${game.image_url || 'https://via.placeholder.com/60x40?text=Game'})` }}
                  />
                  <div className={styles.activityContent}>
                    <div className={styles.activityGameTitle}>{game.title}</div>
                    <div className={styles.activityStatus}>
                      <span 
                        className={styles.statusIndicator}
                        style={{ backgroundColor: getStatusColor(game.status) }}
                      />
                      {getStatusText(game.status)}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      
      {/* Quick actions */}
      <section className={styles.quickActions}>
        <Link to="/addgame" className={styles.actionCard}>
          <div className={styles.actionIcon}>+</div>
          <div className={styles.actionText}>Add Game</div>
        </Link>
        
        <Link to="/library" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </div>
          <div className={styles.actionText}>Browse Library</div>
        </Link>
        
        <Link to="/stats" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 20V10"></path>
              <path d="M12 20V4"></path>
              <path d="M6 20v-6"></path>
            </svg>
          </div>
          <div className={styles.actionText}>View Stats</div>
        </Link>
      </section>
    </div>
  );
};

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'playing': return '#4CAF50'; // Green
    case 'completed': return '#2196F3'; // Blue
    case 'backlog': return '#FFC107'; // Yellow/Amber
    case 'abandoned': return '#9E9E9E'; // Gray
    default: return '#9E9E9E';
  }
};

// Helper function to get readable status text
const getStatusText = (status) => {
  switch (status) {
    case 'playing': return 'Currently Playing';
    case 'completed': return 'Completed';
    case 'backlog': return 'In Backlog';
    case 'abandoned': return 'Abandoned';
    default: return 'Unknown Status';
  }
};

export default Home;