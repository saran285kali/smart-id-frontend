import { createContext, useContext, useState, useEffect } from "react";
import tokenService from "../services/token.service";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const hydrateUserFromToken = () => {
        const token = tokenService.get();
        if (!token) return null;

        try {
            const decoded = jwtDecode(token);
            if (!decoded?.id || !decoded?.role) {
                tokenService.clear();
                return null;
            }
            return {
                id: decoded.id,
                role: decoded.role,
                name: decoded.name || null
            };
        } catch (err) {
            console.error("Token decoding failed:", err);
            tokenService.clear();
            return null;
        }
    };

    useEffect(() => {
        setUser(hydrateUserFromToken());
        setLoading(false);
    }, []);

    const login = (token) => {
        tokenService.set(token);
        const decodedUser = hydrateUserFromToken();
        setUser(decodedUser);
        console.log("AuthProvider: Login successful", decodedUser);
        return decodedUser; // Returning user for immediate navigation
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

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;