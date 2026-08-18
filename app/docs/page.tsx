import type { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Documentation — The Desk',
  description: 'Guides for setting up entities and reading each monitor in The Desk.',
};

export default function Docs() {
  return (
    <PagePlaceholder
      kicker="Documentation"
      title="Everything The Desk does, explained."
      lede="How to set up a workspace, bring in an entity's data, and read each monitor — from the QFZP threshold gauge to the compliance calendar."
      planned="It will hold the setup guide, a walkthrough of each screen, and reference notes on how every threshold is calculated."
    />
  );
}
