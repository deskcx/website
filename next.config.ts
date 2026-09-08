import type { NextConfig } from "next";

/*
 * Fail the build when the auth callback's configuration is missing.
 *
 * NEXT_PUBLIC_* values are inlined at build time. When they are absent Next
 * leaves `process.env.NEXT_PUBLIC_…` in the bundle, which is `undefined` in the
 * browser — so the build succeeds, the deploy succeeds, and /auth/callback
 * tells every invitee "this page is not configured to reach the authentication
 * server". Nothing surfaces until a real person clicks a real invitation.
 *
 * That is exactly what happened: the values lived in .env.local, which is
 * correctly gitignored, so Vercel never had them and no build ever complained.
 *
 * Checked only for production builds. `next dev` and local `next build` are
 * left alone, since the rest of the site is marketing pages that do not need
 * these and there is no reason to block working on them.
 */
const REQUIRED = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (process.env.VERCEL_ENV === 'production') {
  const missing = REQUIRED.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment ${missing.length === 1 ? 'variable' : 'variables'}: ${missing.join(', ')}.\n\n` +
        'Set them in Vercel under Settings -> Environment Variables (Production),\n' +
        'then redeploy — NEXT_PUBLIC_* values are baked in at build time, so an\n' +
        'existing deployment will not pick them up.\n\n' +
        'Values are in website/.env.example. Both are public by design: the URL\n' +
        'identifies the project and the key is the publishable one. Never set the\n' +
        'secret key here.\n\n' +
        'Without these, /auth/callback cannot reach GoTrue and every invitation\n' +
        'and password-reset link fails with "this page is not configured".',
    );
  }
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
