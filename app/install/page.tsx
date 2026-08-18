import type { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Install — The Desk',
  description: 'Download and install The Desk on macOS or Windows.',
};

export default function Install() {
  return (
    <PagePlaceholder
      kicker="Install"
      title="Get The Desk on your machine."
      lede="The Desk is a desktop application. Your entity data stays on your own machine rather than in a shared cloud tenancy."
      planned="It will carry the macOS and Windows downloads, system requirements, and first-run setup steps."
    />
  );
}
