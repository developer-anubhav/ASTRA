'use client';

import * as React from 'react';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Anchor,
  Plane,
  Satellite,
  Radio,
  Database,
  Info,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { analyticsService, sourcesService } from '@/services';
import type { AnalyticsSummary, DataSource } from '@/types';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#22c55e',
  informational: '#6b7280',
};

const CATEGORY_COLORS = [
  '#00c8d7',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#10b981',
];

export default function AnalyticsPage() {
  const [summary, setSummary] = React.useState<AnalyticsSummary | null>(null);
  const [sources, setSources] = React.useState<DataSource[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      try {
        const [aRes, sRes] = await Promise.all([
          analyticsService.getOverview(),
          sourcesService.getSources(),
        ]);
        if (aRes.data) setSummary(aRes.data);
        if (sRes.data) setSources(sRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading || !summary) {
    return <LoadingSpinner label="Compiling multi-domain analytical aggregates..." />;
  }

  // Format events by category for Recharts
  const categoryData = Object.entries(summary.eventsByCategory)
    .filter(([_, count]) => count > 0)
    .map(([cat, count]) => ({
      name: cat.toUpperCase(),
      count,
    }));

  // Format events by severity
  const severityData = Object.entries(summary.eventsBySeverity)
    .filter(([_, count]) => count > 0)
    .map(([sev, count]) => ({
      name: sev.toUpperCase(),
      count,
      color: SEVERITY_COLORS[sev] || '#6b7280',
    }));

  // Format vessels by type
  const vesselData = Object.entries(summary.vesselsByType || {}).map(
    ([type, count]) => ({
      name: type.toUpperCase(),
      count: count || 0,
    })
  );

  // Format aircraft by category
  const aircraftData = Object.entries(summary.aircraftByCategory || {}).map(
    ([cat, count]) => ({
      name: cat.toUpperCase(),
      count: count || 0,
    })
  );

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto select-none p-4 space-y-4 bg-[var(--astra-bg-base)]">
      {/* Top Banner */}
      <DemoBanner
        domain="Analytics Domain"
        message="Analytics strictly reflect records currently available in demonstration storage. Graphs do not extrapolate beyond the local dataset."
      />

      {/* Page Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--astra-border)]">
        <div>
          <h1 className="text-base font-bold font-mono text-[var(--astra-text-primary)]">
            GLOBAL INTELLIGENCE ANALYTICS
          </h1>
          <p className="text-xs text-[var(--astra-text-secondary)]">
            Aggregated situational indices across maritime, air, space, and event registries.
          </p>
        </div>
        <Badge variant="default" className="font-mono">
          DERIVED METRICS
        </Badge>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3 bg-[var(--astra-bg-surface)] border-[var(--astra-border)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--astra-text-muted)] uppercase">
              MARITIME HULLS
            </span>
            <Anchor className="h-4 w-4 text-[var(--astra-accent)]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--astra-text-primary)] mt-1">
            {summary.vesselCount}
          </div>
          <span className="text-[10px] text-[var(--astra-text-secondary)]">
            Simulated AIS Tracks
          </span>
        </Card>

        <Card className="p-3 bg-[var(--astra-bg-surface)] border-[var(--astra-border)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--astra-text-muted)] uppercase">
              AIR OBJECTS
            </span>
            <Plane className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--astra-text-primary)] mt-1">
            {summary.aircraftCount}
          </div>
          <span className="text-[10px] text-[var(--astra-text-secondary)]">
            Active ADS-B Fixes
          </span>
        </Card>

        <Card className="p-3 bg-[var(--astra-bg-surface)] border-[var(--astra-border)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--astra-text-muted)] uppercase">
              SATELLITES
            </span>
            <Satellite className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--astra-text-primary)] mt-1">
            {summary.satelliteCount}
          </div>
          <span className="text-[10px] text-[var(--astra-text-secondary)]">
            Propagated Objects
          </span>
        </Card>

        <Card className="p-3 bg-[var(--astra-bg-surface)] border-[var(--astra-border)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--astra-text-muted)] uppercase">
              LOGGED EVENTS
            </span>
            <Radio className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--astra-text-primary)] mt-1">
            {summary.eventCount}
          </div>
          <span className="text-[10px] text-[var(--astra-text-secondary)]">
            Current Dispatches
          </span>
        </Card>
      </div>

      {/* Middle Analytical Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Events by Category Bar Chart */}
        <Card className="p-4 bg-[var(--astra-bg-surface)] border-[var(--astra-border)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold text-[var(--astra-text-primary)] uppercase">
              EVENTS BY DOMAIN CATEGORY
            </h3>
            <Badge variant="outline" className="text-[9px]">
              OBSERVED FREQUENCY
            </Badge>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" />
                <XAxis dataKey="name" stroke="#8895a8" fontSize={10} interval={0} angle={-25} textAnchor="end" />
                <YAxis stroke="#8895a8" fontSize={10} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141820',
                    borderColor: '#2a3548',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#e8eaf0',
                  }}
                />
                <Bar dataKey="count" fill="#00c8d7" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Events by Severity Pie Chart */}
        <Card className="p-4 bg-[var(--astra-bg-surface)] border-[var(--astra-border)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold text-[var(--astra-text-primary)] uppercase">
              EVENT SEVERITY CLASSIFICATION
            </h3>
            <Badge variant="outline" className="text-[9px]">
              URGENCY DISTRIBUTION
            </Badge>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141820',
                    borderColor: '#2a3548',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#e8eaf0',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono">
            {severityData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[var(--astra-text-secondary)]">{s.name}:</span>
                <span className="font-bold text-[var(--astra-text-primary)]">{s.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Domain Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vessels by Type */}
        <Card className="p-4 bg-[var(--astra-bg-surface)] border-[var(--astra-border)] space-y-3">
          <h3 className="font-mono text-xs font-semibold text-[var(--astra-text-primary)] uppercase">
            VESSEL CLASSIFICATION BREAKDOWN
          </h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vesselData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" />
                <XAxis type="number" stroke="#8895a8" fontSize={10} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#8895a8" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141820',
                    borderColor: '#2a3548',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#e8eaf0',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Aircraft by Category */}
        <Card className="p-4 bg-[var(--astra-bg-surface)] border-[var(--astra-border)] space-y-3">
          <h3 className="font-mono text-xs font-semibold text-[var(--astra-text-primary)] uppercase">
            AIRFRAME CATEGORY DISTRIBUTION
          </h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aircraftData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" />
                <XAxis dataKey="name" stroke="#8895a8" fontSize={10} />
                <YAxis stroke="#8895a8" fontSize={10} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141820',
                    borderColor: '#2a3548',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#e8eaf0',
                  }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Provenance & Soundness Guideline */}
      <div className="p-3 rounded bg-[var(--astra-bg-elevated)] border border-[var(--astra-border)] flex items-start gap-3 text-xs text-[var(--astra-text-secondary)]">
        <Info className="h-4 w-4 text-[var(--astra-accent)] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-[var(--astra-text-primary)]">
            Analytical Soundness & Sample Boundary:
          </span>
          <p className="leading-relaxed text-[11px]">
            Statistical graphs represent solely the in-memory or cached sample size. They do not claim universal global coverage. Absence of markers does not imply an absence of real-world activity, only that no authorized sensor feed has confirmed telemetry in that envelope.
          </p>
        </div>
      </div>
    </div>
  );
}
