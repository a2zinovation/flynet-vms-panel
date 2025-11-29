import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // very small placeholder -- replace with real login later
  const [user, setUser] = useState({ name: "VMS User" });
  const login = (credentials) => { setUser({ name: "VMS User" }); };
  const logout = () => { setUser(null); };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
