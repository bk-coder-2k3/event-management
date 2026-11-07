import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/features/auth/AuthContext';

export const metadata: Metadata = {
  title: 'KalyanaConnect | Tamil Nadu Wedding Vendor Marketplace',
  description:
    'Find and book verified wedding vendors in Madurai and across Tamil Nadu. Marriage halls, candid photographers, catering virundhu, bridal makeup, and stage decorators.',
  keywords: [
    'Tamil wedding',
    'Madurai marriage hall',
    'kalyana mandapam',
    'Tamil Nadu wedding photographers',
    'wedding catering virundhu',
    'bridal makeup Madurai',
    'Tamil wedding planners',
  ],
  openGraph: {
    title: 'KalyanaConnect - Find Your Perfect Wedding Team',
    description:
      'Discover trusted wedding vendors in Tamil Nadu. Compare quotes, inspect verified portfolios, and book directly.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-ivory-100 antialiased selection:bg-gold-200 selection:text-burgundy-950">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
