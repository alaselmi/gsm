import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Load session once on app start
  useEffect(() => {
    const stored = localStorage.getItem("gsm_user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    setLoading(false);
  }, []);

  // login
  const login = (email, password) => {
    const fakeUser = {
      id: Date.now(),
      email,
      role: "admin",
    };

    setUser(fakeUser);
    localStorage.setItem("gsm_user", JSON.stringify(fakeUser));
  };

  // logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("gsm_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);