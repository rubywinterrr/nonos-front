import { createContext } from 'react';
import type { Usuario, LoginCredentials } from '../services/authService';

interface AuthContextType {
    usuario: Usuario | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
