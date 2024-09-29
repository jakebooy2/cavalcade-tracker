'use client';
import styles from "../styles/style.module.css";

import { useContext } from "react";
import { ThemeContext } from "@/app/theme-provider";


const ThemeSelector = () => {
    const { theme: selectedTheme, setTheme } = useContext(ThemeContext);

    const handleThemeChange = (theme: string) => {
        setTheme(theme);
    };

    const classNames = (...classes: string[]) => {
        return classes.filter(Boolean).join(' ');
    };

    return (
        <div className={styles.themeSwitcher} onClick={() => handleThemeChange(selectedTheme == "dark" ? "light" : "dark")}>
            {selectedTheme == "dark" ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
        </div>
    );
};

export default ThemeSelector;