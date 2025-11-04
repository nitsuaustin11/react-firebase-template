import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TestPage from '../components/TestPage';

export default function HomePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/auth');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Dating App</h1>
          <div style={styles.userSection}>
            <div style={styles.userInfo}>
              <span style={styles.userName}>
                {currentUser?.displayName || currentUser?.email?.split('@')[0]}
              </span>
              {currentUser?.emailVerified ? (
                <span style={styles.verified}>✓ Verified</span>
              ) : (
                <span style={styles.unverified}>! Unverified</span>
              )}
            </div>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.welcome}>
          <h2 style={styles.welcomeTitle}>
            Welcome{currentUser?.displayName ? `, ${currentUser.displayName}` : ''}!
          </h2>
          <p style={styles.welcomeText}>
            You're now logged in and can access all features of the app.
          </p>
        </div>

        <div style={styles.content}>
          <TestPage />
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: 'clamp(12px, 3vw, 16px) clamp(12px, 4vw, 24px)',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px'
  },
  title: {
    fontSize: 'clamp(18px, 5vw, 24px)',
    fontWeight: '700',
    color: '#333',
    margin: '0',
    whiteSpace: 'nowrap'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(8px, 2vw, 16px)',
    flexShrink: 0
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },
  userName: {
    fontSize: 'clamp(12px, 3vw, 14px)',
    fontWeight: '500',
    color: '#333',
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  verified: {
    fontSize: 'clamp(10px, 2.5vw, 12px)',
    color: '#2a2',
    backgroundColor: '#efe',
    padding: '2px 6px',
    borderRadius: '4px',
    whiteSpace: 'nowrap'
  },
  unverified: {
    fontSize: 'clamp(10px, 2.5vw, 12px)',
    color: '#c60',
    backgroundColor: '#ffe',
    padding: '2px 6px',
    borderRadius: '4px',
    whiteSpace: 'nowrap'
  },
  logoutButton: {
    padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)',
    fontSize: 'clamp(12px, 3vw, 14px)',
    fontWeight: '500',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    whiteSpace: 'nowrap',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'clamp(16px, 4vw, 24px)',
    boxSizing: 'border-box'
  },
  welcome: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: 'clamp(16px, 4vw, 24px)',
    marginBottom: 'clamp(16px, 4vw, 24px)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  welcomeTitle: {
    fontSize: 'clamp(20px, 5vw, 24px)',
    fontWeight: '600',
    color: '#333',
    marginTop: '0',
    marginBottom: '8px',
    wordWrap: 'break-word'
  },
  welcomeText: {
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    color: '#666',
    margin: '0',
    lineHeight: '1.5'
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: 'clamp(16px, 4vw, 24px)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflowX: 'auto'
  }
};
