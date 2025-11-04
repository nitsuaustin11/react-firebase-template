import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ onToggleForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={styles.input}
            disabled={loading}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={styles.input}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={styles.links}>
        <button
          onClick={() => onToggleForm('reset')}
          style={styles.linkButton}
          type="button"
        >
          Forgot Password?
        </button>

        <div style={styles.separator}>
          Don't have an account?{' '}
          <button
            onClick={() => onToggleForm('signup')}
            style={styles.linkButton}
            type="button"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: 'clamp(22px, 5vw, 28px)',
    fontWeight: '600',
    color: '#333'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center',
    fontSize: 'clamp(13px, 3.5vw, 14px)',
    wordWrap: 'break-word'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%'
  },
  label: {
    fontSize: 'clamp(13px, 3.5vw, 14px)',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    WebkitAppearance: 'none',
    appearance: 'none'
  },
  button: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'background-color 0.2s',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent'
  },
  links: {
    marginTop: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: 'clamp(13px, 3.5vw, 14px)',
    textDecoration: 'underline',
    padding: '8px',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent'
  },
  separator: {
    fontSize: 'clamp(13px, 3.5vw, 14px)',
    color: '#666'
  }
};
