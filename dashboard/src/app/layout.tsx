import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Шефе Brain v2 — Autonomous AI Workforce',
  description: 'Dashboard for Шефе’s self-evolving AI workforce. brain.svd-clean.de',
  metadataBase: new URL('https://brain.svd-clean.de'),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-navy-950 text-[#F8FAFC]">
        {children}
        <Toaster richColors position="top-right" theme="dark" />
      </body>
    </html>
  );
}
