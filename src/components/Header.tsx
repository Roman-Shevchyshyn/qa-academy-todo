import { Link } from 'react-router-dom';

interface HeaderProps {
  user: string | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="topbar">
      <Link className="brand" to="/">
        QA Academy Todo
      </Link>
      <nav className="auth-nav">
        {user ? (
          <>
            <span data-testid="greeting">Hi, {user}</span>
            <button type="button" onClick={onLogout}>
              Log out
            </button>
          </>
        ) : (
          <Link to="/login">Sign in</Link>
        )}
      </nav>
    </header>
  );
}
