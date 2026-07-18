import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL;

// Decode JWT payload without verifying signature (client-side only, for display)
const decodeToken = (jwt) => {
  try {
    return JSON.parse(atob(jwt.split(".")[1]));
  } catch {
    return null;
  }
};

const getInitialUser = () => {
  try {
    const stored = localStorage.getItem("user");
    if (stored) return JSON.parse(stored);

    // Fallback: extract userId from JWT so isMine works before /auth/me resolves
    const token = localStorage.getItem("token");
    if (token) {
      const payload = decodeToken(token);
      if (payload?.id) return { id: payload.id.toString() };
    }
  } catch { /* */ }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUserState] = useState(getInitialUser);

  // Hydrate full user profile from server (displayName, handle, avatar…)
  useEffect(() => {
    if (!token) return;
    // If we only have id (from JWT decode), fetch the rest
    const needsHydration = !user?.displayName;
    if (!needsHydration) return;

    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setUserState(data);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch(() => {
        setToken(null);
        localStorage.removeItem("token");
      });
  }, [token]);

  const setUser = (updater) => {
    setUserState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  const login = (userData, jwt) => {
    setUserState(userData);
    setToken(jwt);
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUserState(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export default AuthContext;
