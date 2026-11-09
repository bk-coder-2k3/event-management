import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/features/auth/AuthContext';

export const metadata: Metadata = {
  title: 'VizhaSpace | Executive Admin Control Center (vizhaspace.in)',
  description: 'Manage event vendor verification, review moderation, user accounts, and security audit logs on VizhaSpace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 antialiased selection:bg-gold-200 selection:text-burgundy-950">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

