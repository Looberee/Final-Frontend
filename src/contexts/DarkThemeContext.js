// DarkThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkThemeContext = createContext();

const lightTheme = {
    icon_sidebar_background: {
        iconColor: '#000000',
        backgroundColor: '#ffffff',
    }
};

const darkTheme = {
    icon_sidebar_background: {
        iconColor: '#ffffff',
        backgroundColor: '#343a40',
        // Add more colors as needed
    },
};

export const DarkThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const theme = isDarkMode ? darkTheme : lightTheme;

    useEffect(() => {
        document.documentElement.style.setProperty('--icon-color', theme.icon_sidebar_background.iconColor);
        document.documentElement.style.setProperty('--background-color', theme.icon_sidebar_background.backgroundColor);
        /* Update more variables as needed */
    }, [theme]);

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return (
        <DarkThemeContext.Provider value={{ theme, toggleDarkMode }}>
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