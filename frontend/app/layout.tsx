import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recipe Explorer",
  description: "Explore delicious recipes from around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className={styles.header}>
          <div className={`container ${styles.headerContainer}`}>
            <Link href="/" className={styles.logo}>
              Recipe Explorer
            </Link>
            <nav className={styles.nav}>
              <ul>
                <li className={styles.navItem}>
                  <Link href="/" className={styles.navLink}>
                    Home
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className={styles.footer}>
          <div className="container">
            <p className={styles.footerText}>
              © {new Date().getFullYear()} Recipe Explorer. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
