import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'The Desk — UAE free zone compliance, tracked continuously',
  description:
    'The Desk keeps QFZP thresholds, VAT positions, and ESR & UBO filings up to date for every entity you manage, so you know where you stand before a deadline arrives.',
};

// Applied before paint so a dark-theme visitor never sees a light flash.
const THEME_INIT = `(function(){try{var s=localStorage.getItem('desk-theme');var t=s==='dark'||s==='light'?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The inline script below stamps data-theme before React hydrates, so the html
    // element is expected to differ from the server markup.
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
