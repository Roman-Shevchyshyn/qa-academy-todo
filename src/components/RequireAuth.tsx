import { Navigate } from 'react-router-dom';
import { getUser } from '../store';
import type { ReactElement } from 'react';

// Redirects anonymous visitors to the login page.
export function RequireAuth({ children }: { children: ReactElement }) {
  return getUser() ? children : <Navigate to="/login" replace />;
}
