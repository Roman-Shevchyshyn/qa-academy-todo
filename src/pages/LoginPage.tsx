import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { delay, getUser, setUser } from '../store';

const VALID_USERNAME = 'student';
const VALID_PASSWORD = 'qa2026';

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in? Go straight to the task list.
  if (getUser()) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please fill in both fields');
      return;
    }

    // Fake network request: the button is disabled while it is "in flight".
    setSubmitting(true);
    await delay(800);
    setSubmitting(false);

    if (username.trim() === VALID_USERNAME && password === VALID_PASSWORD) {
      setUser(username.trim());
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  }

  return (
    <>
      <Header user={null} />

      <main className="card card--narrow">
        <h1>Sign in</h1>
        <p className="hint">
          Sign in to see your tasks. Demo credentials: <code>student</code> / <code>qa2026</code>
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button id="login-button" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </main>
    </>
  );
}
