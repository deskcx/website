import type { Metadata } from 'next';
import styles from './install.module.css';

export const metadata: Metadata = {
  title: 'Install — The Desk',
  description: 'Download The Desk for macOS. Windows and Linux support is on the way.',
};

const REPO = 'deskcx/releases';
const MAC_ASSET = 'The-Desk-UAE-macos-arm64.dmg';
const LATEST_MAC = `https://github.com/${REPO}/releases/latest/download/${MAC_ASSET}`;

// The releases repo is public, so this needs no token. Revalidating hourly keeps the
// page current without spending the unauthenticated GitHub rate limit on every visit.
export const revalidate = 3600;

type GitHubAsset = {
  name: string;
  size: number;
  browser_download_url: string;
  download_count: number;
};

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  html_url: string;
  assets: GitHubAsset[];
};

async function getReleases(): Promise<GitHubRelease[] | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=20`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate },
    });
    if (!res.ok) return null;
    const releases: GitHubRelease[] = await res.json();
    return releases.filter((r) => !r.draft);
  } catch {
    // A GitHub outage should degrade the table, not break the page or the build.
    return null;
  }
}

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const PLATFORMS = [
  {
    id: 'macos',
    name: 'macOS',
    detail: 'Apple Silicon · macOS 11 or later',
    available: true,
  },
  {
    id: 'windows',
    name: 'Windows',
    detail: 'Windows 10 and 11',
    available: false,
  },
  {
    id: 'linux',
    name: 'Linux',
    detail: 'AppImage, .deb and .rpm',
    available: false,
  },
];

export default async function Install() {
  const releases = await getReleases();
  const latest = releases?.[0];

  return (
    <section className={styles.page}>
      <div className="wrap">
        <header className={styles.head}>
          <div className="kicker">Install</div>
          <h1 className={styles.title}>Get The Desk on your machine.</h1>
          <p className={styles.lede}>
            The Desk is a desktop application. Your entity data stays on your own machine rather
            than in a shared cloud tenancy.
          </p>
        </header>

        <div className={styles.platforms}>
          {PLATFORMS.map((platform) => (
            <div
              key={platform.id}
              className={`${styles.card} ${platform.available ? '' : styles.cardMuted}`}
            >
              <div className={styles.cardTop}>
                <h2 className={styles.cardName}>{platform.name}</h2>
                {!platform.available && <span className={styles.soon}>Support coming soon</span>}
              </div>
              <p className={styles.cardDetail}>{platform.detail}</p>

              {platform.available ? (
                <>
                  <a href={LATEST_MAC} className={`btn btn-primary ${styles.cardBtn}`}>
                    Download .dmg
                  </a>
                  {latest && (
                    <p className={styles.cardMeta}>
                      {latest.tag_name} · {formatDate(latest.published_at)}
                    </p>
                  )}
                </>
              ) : (
                <button type="button" className={`btn ${styles.cardBtn} ${styles.btnDisabled}`} disabled>
                  Not yet available
                </button>
              )}
            </div>
          ))}
        </div>

        <div className={styles.warning}>
          <span className={styles.warningBar} />
          <div>
            <strong>This build is not yet signed by Apple.</strong>
            <p>
              macOS will block it the first time you open it. Until we ship a notarized build, open{' '}
              <em>System Settings → Privacy &amp; Security</em>, then click{' '}
              <em>Open Anyway</em> next to The Desk UAE.
            </p>
          </div>
        </div>

        <section className={styles.history}>
          <h2 className={styles.historyTitle}>Release history</h2>

          {releases === null ? (
            <p className={styles.empty}>
              Release information is temporarily unavailable. You can browse every version directly
              on{' '}
              <a href={`https://github.com/${REPO}/releases`} className={styles.inlineLink}>
                GitHub
              </a>
              .
            </p>
          ) : releases.length === 0 ? (
            <p className={styles.empty}>No releases have been published yet.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Version</th>
                    <th>Released</th>
                    <th>Platform</th>
                    <th className={styles.numeric}>Size</th>
                    <th className={styles.numeric}>Downloads</th>
                    <th>
                      <span className={styles.srOnly}>Download</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {releases.map((release) =>
                    release.assets.length === 0 ? (
                      <tr key={release.tag_name}>
                        <td className={styles.version}>{release.tag_name}</td>
                        <td>{formatDate(release.published_at)}</td>
                        <td colSpan={4} className={styles.noAsset}>
                          No downloadable build
                        </td>
                      </tr>
                    ) : (
                      release.assets.map((asset, index) => (
                        <tr key={`${release.tag_name}-${asset.name}`}>
                          <td className={styles.version}>
                            {index === 0 ? release.tag_name : ''}
                            {index === 0 && release === releases[0] && (
                              <span className={styles.latestTag}>Latest</span>
                            )}
                          </td>
                          <td>{index === 0 ? formatDate(release.published_at) : ''}</td>
                          <td>{asset.name.includes('macos') ? 'macOS (arm64)' : asset.name}</td>
                          <td className={styles.numeric}>{formatSize(asset.size)}</td>
                          <td className={styles.numeric}>{asset.download_count}</td>
                          <td>
                            <a href={asset.browser_download_url} className={styles.inlineLink}>
                              Download
                            </a>
                          </td>
                        </tr>
                      ))
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
