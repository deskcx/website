import type { Metadata } from 'next';
import AuthCallback from '@/components/AuthCallback';

export const metadata: Metadata = {
  title: 'Account — The Desk',
  description: 'Finish setting up or recovering your account.',
  // Auth links are single-use and carry credentials in the URL. Keep them out
  // of search results entirely.
  robots: { index: false, follow: false },
};

// GoTrue hands the session back in the URL *fragment* (#access_token=...), which
// never reaches the server. Everything therefore happens client-side.
export default function AuthCallbackPage() {
  return <AuthCallback />;
}
