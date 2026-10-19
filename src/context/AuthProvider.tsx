import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authService, type LoginCredentials } from "../services/authService";
import type { Usuario } from "../services/authService";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    // si no hay token no hay sesión que restaurar, así que arranca sin cargar
    const [loading, setLoading] = useState(localStorage.getItem('nonos_token') !== null);

    useEffect(() => {
        const token = localStorage.getItem('nonos_token');
        if (!token) return;

        authService.getProfile()
            .then((data) => setUsuario(data.user))
            .catch(() => setUsuario(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (credentials: LoginCredentials) => {
        await authService.login(credentials);
        const data = await authService.getProfile();
        setUsuario(data.user);
        return data.user;
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