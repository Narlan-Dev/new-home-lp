import { useContext } from 'react';

// project-imports
import { AuthContext } from 'contexts/auth/AuthContext';

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return context;
}
