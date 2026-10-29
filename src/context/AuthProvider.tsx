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
            .catch((err) => {
                // muestra en la consola por qué falló al restaurar la sesión (sacar después)
                console.error("Error en /auth/me:", err);
                setUsuario(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (credentials: LoginCredentials) => {
        await authService.login(credentials);
        const data = await authService.getProfile();
        setUsuario(data.user);
        return data.user;
    };

    // entra con la cuenta de Google: el back verifica el idToken y devuelve los tokens de Nonos
    const loginConGoogle = async (idToken: string) => {
        await authService.loginWithGoogle(idToken);
        const data = await authService.getProfile();
        setUsuario(data.user);
        return data.user;
    };

    const logout = async () => {
        await authService.logout();
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, loading, login, loginConGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}