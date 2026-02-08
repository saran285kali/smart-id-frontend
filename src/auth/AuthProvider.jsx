import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import tokenService from "../services/token.service";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth from token
    useEffect(() => {
        const token = tokenService.get();

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);

            if (!decoded?.role || !decoded?.id) {
                tokenService.clear();
                setLoading(false);
                return;
            }

            setUser({
                id: decoded.id,
                role: decoded.role,
                exp: decoded.exp
            });
        } catch (err) {
            console.error("JWT decode failed", err);
            tokenService.clear();
        }

        setLoading(false);
    }, []);

    // 🔐 Login MUST trust backend JWT, not frontend role
    const login = (token) => {
        tokenService.set(token);

        const decoded = jwtDecode(token);
        setUser({
            id: decoded.id,
            role: decoded.role,
            exp: decoded.exp
        });
    };

    const logout = () => {
        tokenService.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// helper hook
export const useAuth = () => useContext(AuthContext);
