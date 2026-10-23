'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Globe,
  Anchor,
  Plane,
  Satellite,
  Radio,
  BarChart3,
  BrainCircuit,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Global View', href: '/', icon: Globe, domain: 'all' },
  { name: 'Maritime', href: '/maritime', icon: Anchor, domain: 'maritime' },
  { name: 'Airspace', href: '/airspace', icon: Plane, domain: 'aviation' },
  { name: 'Space / Orbital', href: '/space', icon: Satellite, domain: 'space' },
  { name: 'Global Events', href: '/events', icon: Radio, domain: 'events' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, domain: 'analytics' },
];

const secondaryItems = [
  { name: 'CORTEX AI', href: '/assistant', icon: BrainCircuit, isCortex: true },
  { name: 'Data Sources', href: '/sources', icon: Database },
  { name: 'Settings & Privacy', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-[var(--astra-border)] bg-[var(--astra-bg-surface)] transition-all duration-200 z-30 select-none',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between px-3 border-b border-[var(--astra-border)]">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[var(--astra-bg-elevated)] border border-[var(--astra-border-bright)] text-[var(--astra-accent)] shadow-sm">
            <span className="font-mono font-black text-sm tracking-tighter">AST</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold tracking-widest text-sm text-[var(--astra-text-primary)] font-mono">
                ASTRA
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[var(--astra-text-secondary)] font-mono truncate">
                Global Situational Intel
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[var(--astra-text-secondary)] hover:text-[var(--astra-text-primary)] p-1 rounded hover:bg-[var(--astra-bg-hover)] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--astra-text-muted)] font-mono">
          {!collapsed ? 'Intelligence Domains' : '•'}
        </div>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-2.5 py-2 text-xs font-medium transition-colors group relative',
                isActive
                  ? 'bg-[var(--astra-bg-elevated)] text-[var(--astra-accent)] border border-[var(--astra-accent)]/30 font-semibold'
                  : 'text-[var(--astra-text-secondary)] hover:bg-[var(--astra-bg-hover)] hover:text-[var(--astra-text-primary)]'
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0',
                  isActive ? 'text-[var(--astra-accent)]' : 'text-[var(--astra-text-secondary)] group-hover:text-[var(--astra-text-primary)]'
                )}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-[var(--astra-accent)]" />
              )}
            </Link>
          );
        })}

        <div className="pt-4 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--astra-text-muted)] font-mono">
          {!collapsed ? 'Platform & Reasoning' : '•'}
        </div>
        {secondaryItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isCortex = item.isCortex;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-2.5 py-2 text-xs font-medium transition-colors group relative',
                isCortex
                  ? isActive
                    ? 'bg-[var(--cortex-accent-muted)] text-[var(--cortex-accent)] border border-[var(--cortex-accent)]/40 font-semibold shadow-[0_0_12px_rgba(77,159,255,0.15)]'
                    : 'text-[var(--cortex-accent)] hover:bg-[var(--cortex-accent-muted)] hover:text-white'
                  : isActive
                  ? 'bg-[var(--astra-bg-elevated)] text-[var(--astra-accent)] border border-[var(--astra-border)]'
                  : 'text-[var(--astra-text-secondary)] hover:bg-[var(--astra-bg-hover)] hover:text-[var(--astra-text-primary)]'
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0',
                  isCortex
                    ? 'text-[var(--cortex-accent)]'
                    : isActive
                    ? 'text-[var(--astra-accent)]'
                    : 'text-[var(--astra-text-secondary)]'
                )}
              />
              {!collapsed && (
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{item.name}</span>
                  {isCortex && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      AI
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / Provenance info */}
      <div className="p-2 border-t border-[var(--astra-border)] bg-[var(--astra-bg-base)]">
        {!collapsed ? (
          <div className="rounded p-2 bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[var(--astra-text-muted)]">ENVIRONMENT</span>
              <span className="text-purple-400 font-semibold">DEMO MODE</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-[var(--astra-text-secondary)]">
              <ShieldCheck className="h-3 w-3 text-green-400 shrink-0" />
              <span>Anonymous by design</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-1" title="Demonstration Mode Active · Anonymous by design">
            <span className="h-2 w-2 rounded-full bg-purple-400" />
          </div>
        )}
      </div>
    </aside>
  );
}
