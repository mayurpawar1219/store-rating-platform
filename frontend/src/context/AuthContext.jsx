import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync profile data on mount or when token changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/profile");
        // Profile contains: { id, name, email, address, role }
        setUser(res.data);
        if (res.data.role !== role) {
          setRole(res.data.role);
          localStorage.setItem("role", res.data.role);
        }
      } catch (err) {
        console.error("Profile load failed", err);
        // Clear corrupt or expired session
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        setRole(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, role]);

  const loginUser = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: receivedToken, role: receivedRole } = res.data;
    
    localStorage.setItem("token", receivedToken);
    localStorage.setItem("role", receivedRole);
    
    setToken(receivedToken);
    setRole(receivedRole);
    
    return receivedRole;
  };

  const registerUser = async (name, email, address, password) => {
    return await api.post("/auth/register", { name, email, address, password });
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        loading,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
