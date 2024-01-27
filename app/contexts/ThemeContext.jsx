"use client"
import { useContext, createContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        primaryColor: '#00ADB5',
        secondaryColor: '#222831',
        backgroundColor: '#ffffff',
    });
    return(
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
} 

export const useTheme = () => {
    return useContext(ThemeContext);
}