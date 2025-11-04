import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import ResetPassword from '../components/auth/ResetPassword';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

export default function AuthPage() {
  const [currentForm, setCurrentForm] = useState('login');
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const renderForm = () => {
    switch (currentForm) {
      case 'login':
        return <LoginForm onToggleForm={setCurrentForm} />;
      case 'signup':
        return <SignupForm onToggleForm={setCurrentForm} />;
      case 'reset':
        return <ResetPassword onToggleForm={setCurrentForm} />;
      default:
        return <LoginForm onToggleForm={setCurrentForm} />;
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.authCard}>
        <div style={styles.header}>
          <h1 style={styles.appTitle}>Your App Name</h1>
          <p style={styles.subtitle}>Welcome back! Please sign in to continue</p>
        </div>

        <div style={styles.formContainer}>
          {renderForm()}

          {currentForm !== 'reset' && (
            <>
              <div style={styles.divider}>
                <div style={styles.dividerLine}></div>
                <span style={styles.dividerText}>OR</span>
                <div style={styles.dividerLine}></div>
              </div>

              <GoogleAuthButton />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '16px',
    boxSizing: 'border-box'
  },
  authCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: 'clamp(20px, 5vw, 40px)',
    width: '100%',
    maxWidth: '480px',
    boxSizing: 'border-box'
  },
  header: {
    textAlign: 'center',
    marginBottom: 'clamp(24px, 6vw, 32px)'
  },
  appTitle: {
    fontSize: 'clamp(26px, 7vw, 32px)',
    fontWeight: '700',
    color: '#333',
    marginBottom: '8px',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: 'clamp(14px, 4vw, 16px)',
    color: '#666',
    margin: '0'
  },
  formContainer: {
    width: '100%'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
    gap: '12px'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#ddd'
  },
  dividerText: {
    padding: '0 8px',
    color: '#999',
    fontSize: 'clamp(12px, 3vw, 14px)',
    fontWeight: '500',
    flexShrink: 0
  }
};
