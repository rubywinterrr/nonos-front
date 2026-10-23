import { createContext } from 'react';
import { type Usuario, type LoginCredentials } from '../services/authService';

interface AuthContextType {
    usuario: Usuario | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<Usuario>;
    loginConGoogle: (idToken: string) => Promise<Usuario>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
