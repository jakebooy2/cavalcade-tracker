import styles from "../styles/style.module.css";
import {Metadata, Viewport} from "next";
import {cookies} from "next/headers";
import {useEffect} from "react";
import ThemeProvider from "@/app/theme-provider";

export const metadata: Metadata = {
    title: 'Toontown Rewritten Cavalcade Tracker',
    description: 'Track the Cavalcade with this easy to use website!'
}

export const viewport: Viewport = {
    themeColor: "#5865F2",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const cookieStore = cookies();
    const theme = cookieStore.get('theme');

    return (
        <html lang="en" data-theme={theme?.value ?? "dark"}>
            <head>
                <title>Cavalcade Tracker</title>
            </head>
            <body className={`${styles.body}`}>
                <script src="https://kit.fontawesome.com/0f53078f08.js" crossOrigin="anonymous"></script>
                <ThemeProvider initialTheme={theme?.value ?? "dark"}>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
