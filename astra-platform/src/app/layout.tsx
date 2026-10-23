import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/shell/AppShell';

export const metadata: Metadata = {
  title: 'ASTRA — Global Intelligence & Situational Awareness',
  description:
    'ASTRA: See the world. Understand the signals. Global situational awareness console across maritime, aviation, space, and global events with CORTEX integrated AI reasoning.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="h-full w-full overflow-hidden bg-[var(--astra-bg-base)] text-[var(--astra-text-primary)]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
