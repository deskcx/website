import type { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'About Us — The Desk',
  description: 'Who builds The Desk and why.',
};

export default function About() {
  return (
    <PagePlaceholder
      kicker="About us"
      title="Built by people who have filed these returns."
      lede="The Desk exists because free zone compliance is tracked in spreadsheets that only tell you the truth once a year — usually after the position has already moved."
      planned="It will cover who we are, how the product came about, and the view of UAE free zone compliance it is built on."
    />
  );
}
