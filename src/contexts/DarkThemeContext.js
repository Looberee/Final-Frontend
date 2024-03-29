// DarkThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const DarkThemeContext = createContext();

export const DarkThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
};

const toggleSidebar = () => {
    setSidebarCollapsed((prevCollapsed) => !prevCollapsed);
};

return (
    <DarkThemeContext.Provider value={{ isDarkMode, toggleDarkMode, sidebarCollapsed, toggleSidebar }}>
        {children}
    </DarkThemeContext.Provider>
);
};

export const useDarkTheme = () => {
const context = useContext(DarkThemeContext);
    if (!context) {
        throw new Error('useDarkTheme must be used within a DarkThemeProvider');
    }
        return context;
    };
