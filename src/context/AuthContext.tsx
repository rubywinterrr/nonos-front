import {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import { authService, type LoginCredentials } from '../services/authService';

interface usuario {
    id: string;
    nombreCompleto: string;
    email: string;
    rol: string;
}

interface AuthContextType {
    usuario: usuario | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


