'use client';

import { createContext, useState, ReactNode, useEffect } from 'react';
import { setCookie } from 'cookies-next';

interface ThemeContextType {
    theme: string;
    setTheme: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: "dark",
    setTheme: () => {},
});

interface ThemeProviderProps {
    children: ReactNode;
    initialTheme: string;
}

export default function ThemeProvider({
                                          children,
                                          initialTheme
                                      }: ThemeProviderProps) {
    const [theme, setThemeState] = useState(initialTheme);

    const setTheme = (newTheme: string) => {
        setThemeState(newTheme);
        setCookie('theme', newTheme, { path: '/', maxAge: 28 * 24 * 60 * 60 });
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}