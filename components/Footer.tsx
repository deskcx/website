import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.row}>
          <span>© {new Date().getFullYear()} The Desk UAE</span>
          <div className={styles.links}>
            <Link href="/about">About Us</Link>
            <Link href="/install">Install</Link>
            <Link href="/docs">Documentation</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
