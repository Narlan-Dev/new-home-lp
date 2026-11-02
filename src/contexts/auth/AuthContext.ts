import { createContext } from 'react';

// types
import { AuthContextValue } from 'types/auth';

export const AuthContext = createContext<AuthContextValue | null>(null);
