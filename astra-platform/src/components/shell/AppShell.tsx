'use client';

import * as React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--astra-bg-base)] text-[var(--astra-text-primary)]">
      {/* Fixed Left Navigation */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto relative flex flex-col min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
