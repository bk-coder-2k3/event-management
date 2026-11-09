import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/features/auth/AuthContext';

export const metadata: Metadata = {
  title: 'VizhaSpace | Tamil Nadu All-Event & Wedding Marketplace (vizhaspace.in)',
  description:
    'Discover, compare, and book verified event venues, banquet halls, kalyana mandapams, party caterers, photographers, and decorators across Tamil Nadu on vizhaspace.in.',
  keywords: [
    'VizhaSpace',
    'vizhaspace.in',
    'Tamil event marketplace',
    'Madurai banquet hall',
    'kalyana mandapam',
    'birthday party venues Tamil Nadu',
    'corporate event planners',
    'Tamil Nadu wedding photographers',
    'wedding catering virundhu',
    'bridal makeup Madurai',
  ],
  openGraph: {
    title: 'VizhaSpace - Tamil Nadu All-Event & Wedding Services Marketplace',
    description:
      'Discover trusted event & celebration service providers across Tamil Nadu. Compare quotes, inspect verified portfolios, and book directly on vizhaspace.in.',
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
