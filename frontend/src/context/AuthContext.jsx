/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const readStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem("userInfo"));
    } catch {
        localStorage.removeItem("userInfo");
        return null;
    }
};

function AuthProvider({ children }) {
    const [userInfo, setUserInfo] = useState(readStoredUser);

    const login = (data) => {
        localStorage.setItem("userInfo", JSON.stringify(data));
        setUserInfo(data);
    };

    const logout = () => {
        localStorage.removeItem("userInfo");
        setUserInfo(null);
    };

    const role = userInfo?.user?.role || userInfo?.role;
    const token = userInfo?.token;

    const value = useMemo(() => ({
        userInfo,
        role,
        token,
        isAuthenticated: Boolean(userInfo),
        isAdmin: role === "admin",
        login,
        logout,
    }), [userInfo, role, token]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};

export { AuthProvider, useAuth };
