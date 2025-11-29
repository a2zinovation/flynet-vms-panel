import React, { createContext, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed((s) => !s);

  return (
    <AppContext.Provider value={{ sidebarCollapsed, toggleSidebar }}>
      {children}
    </AppContext.Provider>
  );
}
