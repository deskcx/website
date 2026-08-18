import Link from 'next/link';
import styles from './page.module.css';

const STEPS = [
  {
    step: '01 · Set up',
    title: 'Add an entity',
    body: 'Create a workspace for each entity you manage, then bring in its trading data and source documents. The Desk builds the compliance structure around them.',
  },
  {
    step: '02 · Monitor',
    title: 'Watch thresholds move',
    body: 'Qualifying-income ratios, VAT position, and ESR & UBO status update as transactions and filings come in — not once a year when it is already too late to correct.',
  },
  {
    step: '03 · File',
    title: 'Act on what is due',
    body: 'A compliance calendar surfaces what is next, generates the supporting workpapers, and keeps an audit trail of what was filed and when.',
  },
];

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`wrap ${styles.heroGrid}`}>
          <div>
            <span className={styles.eyebrow}>
              <span className={styles.pip} />
              Built for DMCC · JAFZA · ADGM
            </span>
            <h1 className={styles.h1}>
              Free zone compliance, tracked the way regulators{' '}
              <span className={styles.accent}>actually check it</span>.
            </h1>
            <p className={styles.lede}>
              The Desk is a desktop app that turns QFZP thresholds, VAT positions, ESR &amp; UBO
              filings, and your compliance calendar into one running picture per entity — so you
              always know exactly where you stand, before a deadline forces you to find out.
            </p>
            <div className={styles.ctas}>
              <Link href="/install" className="btn btn-primary">
                Install The Desk
              </Link>
              <Link href="/docs" className="btn btn-ghost">
                Read the documentation →
              </Link>
            </div>
            <div className={styles.zoneStrip}>
              Live thresholds for
              <span className={styles.zones}>
                <span className={styles.zoneChip}>DMCC</span>
                <span className={styles.zoneChip}>JAFZA</span>
                <span className={styles.zoneChip}>ADGM</span>
              </span>
            </div>
          </div>

          <div className={styles.visual}>
            <div className={styles.visualHead}>
              <span className={styles.visualTitle}>QFZP Monitor</span>
              <span className={styles.visualBadge}>Qualifying</span>
            </div>
            <div className={styles.gaugeRow}>
              <div className={styles.gaugeRing}>
                <div className={styles.gaugeInner}>
                  <span className={styles.gaugePct}>70%</span>
                  <span className={styles.gaugeLbl}>OF LIMIT</span>
                </div>
              </div>
              <div>
                <div className={styles.gaugeTitle}>Non-qualifying revenue ratio</div>
                <div className={styles.gaugeSub}>Measured against the 5% de minimis threshold</div>
              </div>
            </div>
            <div className={styles.visualRows}>
              <div className={styles.visualItem}>
                <span className={styles.itemLabel}>VAT return — current quarter</span>
                <span className={`${styles.itemValue} ${styles.valueOk}`}>Filed</span>
              </div>
              <div className={styles.visualItem}>
                <span className={styles.itemLabel}>ESR notification</span>
                <span className={`${styles.itemValue} ${styles.valueOk}`}>On track</span>
              </div>
              <div className={styles.visualItem}>
                <span className={styles.itemLabel}>UBO declaration renewal</span>
                <span className={`${styles.itemValue} ${styles.valueDue}`}>Due in 12 days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="wrap">
          <div className={styles.sectionHead}>
            <div className="kicker">How it works</div>
            <h2 className={styles.h2}>Three moving parts, one workspace.</h2>
            <p className={styles.sectionLede}>
              The Desk sits on top of the documents and transactions you already have, and keeps a
              live compliance position for every entity in view.
            </p>
          </div>
          <div className={styles.steps}>
            {STEPS.map((item) => (
              <div key={item.step} className={styles.stepCard}>
                <div className={styles.stepLabel}>{item.step}</div>
                <h3 className={styles.h3}>{item.title}</h3>
                <p className={styles.stepBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.strip}>
        <div className={`wrap ${styles.stripInner}`}>
          <div>
            <h2 className={styles.h2}>Ready to see your own numbers?</h2>
            <p className={styles.stripLede}>
              Install The Desk on your machine, or read the docs to see how a workspace is set up.
            </p>
          </div>
          <div className={styles.stripCtas}>
            <Link href="/install" className="btn btn-primary">
              Install
            </Link>
            <Link href="/docs" className="btn btn-ghost">
              Documentation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
