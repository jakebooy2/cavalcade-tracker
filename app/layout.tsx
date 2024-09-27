import styles from "../styles/style.module.css";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Toontown Rewritten Cavalcade Tracker',
    description: 'Track the Cavalcade with this easy to use website!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <title>Cavalcade Tracker</title>
      <body className={styles.body}>
          <script src="https://kit.fontawesome.com/0f53078f08.js" crossOrigin="anonymous"></script>
          {children}
      </body>
    </html>
  );
}
