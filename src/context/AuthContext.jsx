import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // State sekarang untuk accessToken
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.get("/users/profile");
          setUser(response.data);
        } catch (error) {
          console.error("Token tidak valid, sesi dihapus.", error);
          logout();
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [token]);

  // Fungsi login sekarang menerima kedua token
  const login = (newAccessToken, newRefreshToken, userData) => {
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    setToken(newAccessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setUser(null);
  };

  const value = {
    isAuthenticated: !!token,
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
