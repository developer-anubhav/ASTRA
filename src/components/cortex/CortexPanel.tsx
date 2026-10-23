'use client';

import * as React from 'react';
import { BrainCircuit, X, Send, Sparkles, AlertCircle, Info, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { assistantService } from '@/services';
import type { CortexQueryResponse, CortexFinding } from '@/types';
import { SourceTag } from '@/components/shared/SourceTag';

interface CortexPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contextEntityId?: string;
  contextEntityType?: string;
  contextTitle?: string;
}

export function CortexPanel({
  isOpen,
  onClose,
  contextEntityId,
  contextEntityType,
  contextTitle,
}: CortexPanelProps) {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState<CortexQueryResponse | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const res = await assistantService.query({
        query: query.trim(),
        context: contextEntityId && (contextEntityType === 'vessel' || contextEntityType === 'aircraft' || contextEntityType === 'satellite' || contextEntityType === 'event')
          ? { type: contextEntityType, entityId: contextEntityId }
          : { type: 'general' },
      });
      if (res.data) {
        setResponse(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 z-50 flex flex-col bg-[var(--astra-bg-surface)] border-l border-[var(--cortex-accent)]/30 shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-[var(--astra-border)] bg-[var(--astra-bg-elevated)]">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-[var(--cortex-accent)]" />
          <div className="flex flex-col">
            <span className="font-bold text-xs tracking-wider text-[var(--cortex-accent)] font-mono">
              CORTEX AI REASONING
            </span>
            <span className="text-[10px] text-[var(--astra-text-secondary)]">
              Intelligence Assistant
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close CORTEX panel">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Ephemeral Notice & Context */}
      <div className="p-3 bg-[var(--astra-bg-base)] border-b border-[var(--astra-border)] text-[11px] space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="cortex">SIMULATED ADAPTER</Badge>
          <span className="text-[10px] text-[var(--astra-text-muted)] font-mono">Ephemeral Session</span>
        </div>
        {contextTitle && (
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-[var(--astra-bg-elevated)] border border-[var(--astra-border)] text-[11px]">
            <span className="text-[var(--astra-text-muted)] font-mono">ACTIVE TARGET:</span>
            <span className="font-medium text-[var(--astra-text-primary)] truncate">{contextTitle}</span>
          </div>
        )}
      </div>

      {/* Body / Chat & Findings */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!response && !loading && (
          <div className="text-center py-8 space-y-3">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-[var(--cortex-accent-muted)] border border-[var(--cortex-accent)]/30">
              <Sparkles className="h-6 w-6 text-[var(--cortex-accent)]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-[var(--astra-text-primary)]">
                Ask CORTEX about intelligence data
              </h4>
              <p className="text-[11px] text-[var(--astra-text-secondary)] leading-relaxed">
                Inquire about entity correlations, event timelines, or source validity.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-1.5">
              {[
                'Analyze active maritime traffic',
                'Explain current satellite orbit status',
                'Correlate recent regional events',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                  }}
                  className="text-left text-[11px] p-2 rounded bg-[var(--astra-bg-elevated)] border border-[var(--astra-border)] hover:border-[var(--cortex-accent)]/40 text-[var(--astra-text-secondary)] hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>{suggestion}</span>
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="flex items-center gap-1.5">
              <span className="cortex-dot" />
              <span className="cortex-dot" />
              <span className="cortex-dot" />
            </div>
            <span className="text-xs font-mono text-[var(--cortex-accent)]">
              CORTEX synthesizing signals...
            </span>
          </div>
        )}

        {response && !loading && (
          <div className="space-y-4 text-xs">
            {/* Simulation Warning Banner */}
            <div className="p-2.5 rounded bg-purple-950/40 border border-purple-500/40 text-purple-200 text-[11px]">
              <div className="font-semibold text-purple-300 mb-1 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{response.demoLabel || 'DEMONSTRATION REASONING'}</span>
              </div>
              <p className="text-[10px] leading-relaxed text-purple-200/90">
                This response was synthesized by the demonstration adapter. No live LLM inference has occurred.
              </p>
            </div>

            {/* Structured Summary */}
            <div className="p-3 rounded bg-[var(--astra-bg-elevated)] border border-[var(--astra-border)] space-y-1.5">
              <span className="text-[10px] font-mono text-[var(--cortex-accent)] uppercase tracking-wider font-semibold">
                ASSESSMENT SUMMARY
              </span>
              <p className="text-[11px] text-[var(--astra-text-primary)] leading-relaxed">
                {response.summary}
              </p>
            </div>

            {/* Findings List */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[var(--astra-text-muted)] uppercase tracking-wider font-semibold">
                RETRIEVED FINDINGS ({response.findings.length})
              </span>
              {response.findings.map((f, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded border text-[11px] space-y-1.5 ${
                    f.type === 'fact'
                      ? 'border-blue-500/30 bg-blue-950/20 text-blue-200'
                      : f.type === 'uncertainty'
                      ? 'border-amber-500/30 bg-amber-950/20 text-amber-200'
                      : 'border-[var(--astra-border)] bg-[var(--astra-bg-elevated)] text-[var(--astra-text-primary)]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="uppercase font-semibold tracking-wider">
                      [{f.type}]
                    </span>
                    {f.confidence && (
                      <span className="text-[var(--astra-text-muted)]">
                        Conf: {f.confidence}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">{f.content}</p>
                  {f.sourceRef && <SourceTag source={f.sourceRef} showTime={false} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Tray */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-[var(--astra-border)] bg-[var(--astra-bg-elevated)] flex items-center gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Query CORTEX intelligence..."
          className="flex-1 h-8 px-2.5 text-xs bg-[var(--astra-bg-base)] border border-[var(--astra-border)] rounded text-[var(--astra-text-primary)] placeholder:text-[var(--astra-text-muted)] focus:outline-none focus:border-[var(--cortex-accent)] font-mono"
        />
        <Button
          type="submit"
          variant="cortex"
          size="icon-sm"
          disabled={loading || !query.trim()}
          title="Transmit query"
          aria-label="Transmit query"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}
