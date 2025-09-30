import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: { token: string } | null;
  session: null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setUser(token ? { token } : null);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session: null, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
