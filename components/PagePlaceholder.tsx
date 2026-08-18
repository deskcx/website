import styles from './PagePlaceholder.module.css';

type Props = {
  kicker: string;
  title: string;
  lede: string;
  planned: string;
};

export default function PagePlaceholder({ kicker, title, lede, planned }: Props) {
  return (
    <section className={styles.page}>
      <div className="wrap">
        <div className={styles.inner}>
          <div className="kicker">{kicker}</div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lede}>{lede}</p>
          <div className={styles.note}>
            <span className={styles.noteBar} />
            <div className={styles.noteBody}>
              <strong>This page is still being written.</strong>
              {planned}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
