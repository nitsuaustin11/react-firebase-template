import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function ResetPassword({ onToggleForm }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const result = await resetPassword(email);

    if (result.success) {
      setMessage('Password reset email sent! Check your inbox.');
      setEmail('');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reset Password</h2>
      <p style={styles.description}>
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {error && <div style={styles.error}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}

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

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div style={styles.links}>
        <button
          onClick={() => onToggleForm('login')}
          style={styles.linkButton}
          type="button"
        >
          Back to Login
        </button>
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
    marginBottom: '12px',
    fontSize: 'clamp(22px, 5vw, 28px)',
    fontWeight: '600',
    color: '#333'
  },
  description: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: 'clamp(13px, 3.5vw, 14px)',
    color: '#666',
    lineHeight: '1.5'
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
  }
};
