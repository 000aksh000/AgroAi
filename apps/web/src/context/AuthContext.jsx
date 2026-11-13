import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../api/client";
const AuthContext = createContext(void 0);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("agro_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("agro_access_token");
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("agro_access_token");
      if (storedToken) {
        try {
          const res = await apiClient.get("/auth/me");
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem("agro_user", JSON.stringify(res.data.data));
          }
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem("agro_access_token");
          localStorage.removeItem("agro_user");
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);
  const login = async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });
    if (res.data.success) {
      const { user: userData, tokens } = res.data.data;
      setUser(userData);
      setToken(tokens.accessToken);
      localStorage.setItem("agro_user", JSON.stringify(userData));
      localStorage.setItem("agro_access_token", tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem("agro_refresh_token", tokens.refreshToken);
      }
    }
  };
  const register = async (data) => {
    const res = await apiClient.post("/auth/register", data);
    if (res.data.success) {
      const { user: userData, tokens } = res.data.data;
      setUser(userData);
      setToken(tokens.accessToken);
      localStorage.setItem("agro_user", JSON.stringify(userData));
      localStorage.setItem("agro_access_token", tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem("agro_refresh_token", tokens.refreshToken);
      }
    }
  };
  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("agro_user");
      localStorage.removeItem("agro_access_token");
      localStorage.removeItem("agro_refresh_token");
    }
  };
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("agro_user", JSON.stringify(updatedUser));
  };
  return <AuthContext.Provider
    value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      register,
      logout,
      updateUser
    }}
  >
      {children}
    </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
