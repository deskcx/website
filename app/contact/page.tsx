import type { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Contact Us — The Desk',
  description: 'Get in touch with the team behind The Desk.',
};

export default function Contact() {
  return (
    <PagePlaceholder
      kicker="Contact us"
      title="Get in touch."
      lede="Questions about whether The Desk fits your entities, or something not behaving the way the docs say it should — we would like to hear about it."
      planned="It will carry a contact form and direct details for support and general enquiries."
    />
  );
}
