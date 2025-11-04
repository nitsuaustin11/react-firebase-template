import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignupForm({ onToggleForm }) {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const result = await signup(formData.email, formData.password, formData.displayName);

    if (result.success) {
      setMessage('Account created! Please check your email to verify your account.');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Account</h2>

      {error && <div style={styles.error}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Display Name</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Enter your name"
            style={styles.input}
            disabled={loading}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={styles.input}
            disabled={loading}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password (min 6 characters)"
            style={styles.input}
            disabled={loading}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            style={styles.input}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div style={styles.links}>
        <div style={styles.separator}>
          Already have an account?{' '}
          <button
            onClick={() => onToggleForm('login')}
            style={styles.linkButton}
            type="button"
          >
            Login
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
  success: {
    backgroundColor: '#efe',
    color: '#2a2',
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
    textAlign: 'center'
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
