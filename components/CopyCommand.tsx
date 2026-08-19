'use client';

import { useState } from 'react';
import styles from './CopyCommand.module.css';

export default function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused (insecure context, denied permission).
      // The command is selectable text either way, so fail quietly.
    }
  }

  return (
    <div className={styles.wrap}>
      <code className={styles.code}>{command}</code>
      <button type="button" onClick={copy} className={styles.button}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
