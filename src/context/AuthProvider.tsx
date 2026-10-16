import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authService, type LoginCredentials } from "../services/authService";
import type { Usuario } from "../services/authService";
import { pushService } from "../services/pushService";

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
            .then((data) => {
                setUsuario(data.user);
                pushService.sincronizar().catch(() => {});
            })
            .catch(() => setUsuario(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (credentials: LoginCredentials) => {
        await authService.login(credentials);
        const data = await authService.getProfile();
        setUsuario(data.user);
        pushService.sincronizar().catch(() => {}); // silencioso: no debe bloquear el login
    };

    const logout = async () => {
        try {
            await pushService.liberar(); // ANTES de authService.logout: necesita el token y ese método redirige
        } catch {
            // si falla, igual cerramos sesión
        }
        await authService.logout();
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}