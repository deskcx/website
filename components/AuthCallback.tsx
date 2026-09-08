'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AuthCallback.module.css';

// Talking to GoTrue directly rather than pulling in @supabase/supabase-js: this
// is one PUT against one endpoint, and the marketing site otherwise ships only
// next and react. The anon key is public by design — it identifies the project,
// it does not authenticate anyone.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const MIN_PASSWORD = 8;

type Mode =
  | { kind: 'loading' }
  | { kind: 'setPassword'; token: string; invite: boolean }
  | { kind: 'confirmed' }
  | { kind: 'done' }
  | { kind: 'error'; message: string };

/** Parse a `#a=1&b=2` fragment. Returns an empty map for anything malformed. */
function parseFragment(hash: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of new URLSearchParams(hash.replace(/^#/, ''))) out[k] = v;
  return out;
}

export default function AuthCallback() {
  const [mode, setMode] = useState<Mode>({ kind: 'loading' });
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const handled = useRef(false);

  // The URL fragment does not exist during server rendering, so it cannot be
  // read while deriving initial state — a mount effect is the only place it is
  // available. That makes the single setState below unavoidable rather than a
  // cascading render, which is what this rule is guarding against.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    // Reading the fragment is destructive: the token is wiped from the URL
    // immediately below. A second pass would therefore find nothing and report
    // a broken link over a perfectly good one — which is exactly what React
    // does under StrictMode, and what any remount would do in production.
    if (handled.current) return;
    handled.current = true;

    const frag = parseFragment(window.location.hash);
    const query = new URLSearchParams(window.location.search);

    // The token is a live credential. Drop it from the address bar as soon as
    // it is in memory so it does not leak via history, referrer, or a shared
    // screenshot. The link is single-use, so a reload failing is correct.
    if (window.location.hash || window.location.search) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    // GoTrue reports failures (expired link, already used) in either place.
    const err = frag.error_description ?? frag.error ?? query.get('error_description') ?? query.get('error');
    if (err) {
      setMode({ kind: 'error', message: err.replace(/\+/g, ' ') });
      return;
    }

    if (!SUPABASE_URL || !ANON_KEY) {
      setMode({
        kind: 'error',
        message:
          'This page is not configured to reach the authentication server. Please contact support.',
      });
      return;
    }

    const token = frag.access_token;
    const type = frag.type;

    if (!token) {
      setMode({
        kind: 'error',
        message:
          'This link is missing its sign-in token. It may have already been used, or your email client may have trimmed it.',
      });
      return;
    }

    // recovery = forgot password; invite = first-time set up. Both end in the
    // same form. signup and email_change need no input from the user.
    if (type === 'recovery' || type === 'invite') {
      setMode({ kind: 'setPassword', token, invite: type === 'invite' });
    } else {
      setMode({ kind: 'confirmed' });
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (mode.kind !== 'setPassword') return;

    if (password.length < MIN_PASSWORD) {
      setFormError(`Use at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== confirm) {
      setFormError('The two passwords do not match.');
      return;
    }

    setFormError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          apikey: ANON_KEY as string,
          Authorization: `Bearer ${mode.token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setFormError(
          body?.msg ??
            body?.error_description ??
            body?.message ??
            'That did not work. The link may have expired — request a new one.',
        );
        return;
      }
      // An invited user's organisation membership and entity access are applied
      // here, not by the link itself. accept_invitation() matches on the email
      // GoTrue just verified, so nothing sensitive travels in the URL and the
      // invitee cannot influence what they are granted.
      //
      // Deliberately not fatal. The password is already set at this point, and
      // the desktop app calls the same function on sign-in — it is idempotent
      // precisely so this can fail quietly and still come right.
      if (mode.invite) {
        try {
          await fetch(`${SUPABASE_URL}/rest/v1/rpc/accept_invitation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: ANON_KEY as string,
              Authorization: `Bearer ${mode.token}`,
            },
            body: '{}',
          });
        } catch {
          /* the app retries on first sign-in */
        }
      }

      setMode({ kind: 'done' });
    } catch {
      setFormError('Could not reach the authentication server. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className="wrap">
        <div className={styles.card}>
          {mode.kind === 'loading' && <p className={styles.lede}>Checking your link…</p>}

          {mode.kind === 'error' && (
            <>
              <div className="kicker">Link problem</div>
              <h1 className={styles.title}>This link did not work.</h1>
              <p className={styles.lede}>{mode.message}</p>
              <p className={styles.help}>
                Password links are single-use and expire. Open The Desk and choose
                “Forgot password” to send yourself a fresh one.
              </p>
            </>
          )}

          {mode.kind === 'setPassword' && (
            <>
              <div className="kicker">{mode.invite ? 'Welcome' : 'Password reset'}</div>
              <h1 className={styles.title}>
                {mode.invite ? 'Choose a password.' : 'Set a new password.'}
              </h1>
              <p className={styles.lede}>
                {mode.invite
                  ? 'Pick a password and you will be able to sign in to The Desk.'
                  : 'Once this is saved you can sign in to The Desk with the new password.'}
              </p>

              <form className={styles.form} onSubmit={onSubmit} noValidate>
                <label className={styles.label} htmlFor="password">
                  New password
                </label>
                <input
                  id="password"
                  className={styles.input}
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={MIN_PASSWORD}
                  required
                />

                <label className={styles.label} htmlFor="confirm">
                  Confirm password
                </label>
                <input
                  id="confirm"
                  className={styles.input}
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />

                {formError && (
                  <p className={styles.formError} role="alert">
                    {formError}
                  </p>
                )}

                <button className={`btn btn-primary ${styles.submit}`} type="submit" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Save password'}
                </button>
              </form>
            </>
          )}

          {mode.kind === 'confirmed' && (
            <>
              <div className="kicker">Confirmed</div>
              <h1 className={styles.title}>Your email is confirmed.</h1>
              <p className={styles.lede}>You can close this tab and sign in to The Desk.</p>
            </>
          )}

          {mode.kind === 'done' && (
            <>
              <div className="kicker">All set</div>
              <h1 className={styles.title}>Your password is saved.</h1>
              <p className={styles.lede}>
                Open The Desk and sign in with your email and the new password.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
