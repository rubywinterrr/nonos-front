import {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import { authService, type LoginCredentials, type Usuario } from '../services/authService';

interface AuthContextType {
    usuario: Usuario | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token= localStorage.getItem('nonos_token');
        if (!token){
            setLoading(false);
            return;
        }
        
        authService.getProfile()
        .then((data) => setUsuario(data.user))
        .catch(()=> setUsuario(null))
        .finally(()=> setLoading(false));
    }, []);

    const login = async (credentials: LoginCredentials) => {
        await authService.login(credentials);
        const data = await authService.getProfile()
        setUsuario(data.user);
    };

    const logout = async () => {
        await authService.logout();
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{usuario, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context){
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }

    return context;
}


