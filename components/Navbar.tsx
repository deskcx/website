'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Navbar.module.css';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/install', label: 'Install' },
  { href: '/docs', label: 'Documentation' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // The theme lives on the <html> element, set before paint by the inline script in
  // the root layout. Reading it from the DOM here keeps the server and client markup
  // identical, and the button's glyph is switched by CSS rather than by state.
  function toggleTheme() {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('desk-theme', next);
  }

  return (
    <header className={styles.header}>
      <nav className={`wrap ${styles.nav}`}>
        <Link href="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
          <span className={styles.brandMark}>
            The Desk<span className={styles.dot}>.</span>
          </span>
          <span className={styles.brandTag}>UAE</span>
        </Link>

        <div className={styles.links}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? styles.current : undefined}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.right}>
          <button
            type="button"
            className={styles.toggle}
            onClick={toggleTheme}
            aria-label="Toggle colour theme"
          >
            <span className={styles.iconLight}>◐</span>
            <span className={styles.iconDark}>◑</span>
          </button>
          <Link href="/install" className={`btn btn-primary btn-sm ${styles.installCta}`}>
            Install
          </Link>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu} id="mobile-menu">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? styles.current : undefined}
              aria-current={pathname === link.href ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
