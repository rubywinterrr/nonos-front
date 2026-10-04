import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authService, type LoginCredentials } from "../services/authService";
import type { Usuario } from "../services/authService";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('nonos_token');
        if (!token) {
            setLoading(false);
            return;
        }

        authService.getProfile()
            .then((data) => setUsuario(data.user))
            .catch(() => setUsuario(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (credentials: LoginCredentials) => {
        await authService.login(credentials);
        const data = await authService.getProfile();
        setUsuario(data.user);
    };

    const logout = async () => {
        await authService.logout();
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}