import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/features/auth/AuthContext';

export const metadata: Metadata = {
  title: 'VizhaSpace Partner Portal | Grow Your Event Business (vizhaspace.in)',
  description: 'Manage your event & wedding business, pricing packages, portfolio gallery, and incoming customer enquiries on VizhaSpace (vizhaspace.in).',
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

