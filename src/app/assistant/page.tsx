'use client';

import * as React from 'react';
import {
  BrainCircuit,
  Send,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Info,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Compass,
  ArrowRight,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { SourceTag } from '@/components/shared/SourceTag';
import { assistantService } from '@/services';
import type { CortexQueryResponse, CortexFinding } from '@/types';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  response?: CortexQueryResponse;
  timestamp: string;
}

let messageCounter = 0;
function createMessageId(prefix: string) {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
}

export default function AssistantPage() {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<MessageItem[]>([]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || query).trim();
    if (!q || loading) return;

    const userMsg: MessageItem = {
      id: createMessageId('usr'),
      role: 'user',
      content: q,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await assistantService.query({ query: q });
      if (res.data) {
        const assistantMsg: MessageItem = {
          id: createMessageId('ast'),
          role: 'assistant',
          content: res.data.summary,
          response: res.data,
          timestamp: res.data.generatedAt,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  const samplePrompts = [
    'What vessels are currently being tracked?',
    'Summarize the available satellite orbital elements',
    'What priority events are recorded in the system?',
    'Explain the data provenance model used by ASTRA',
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden select-none bg-[var(--astra-bg-base)]">
      {/* Top Banner */}
      <div className="p-2 border-b border-[var(--astra-border)]">
        <DemoBanner
          domain="CORTEX Reasoning Engine"
          message="CORTEX is operating with a simulated adapter. Responses demonstrate structured reasoning syntax without active LLM inference."
        />
      </div>

      {/* Main Console Workspace */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Informational & Query Prompts Column */}
        <div className="hidden lg:flex w-80 flex-col border-r border-[var(--astra-border)] bg-[var(--astra-bg-surface)] p-4 space-y-4 overflow-y-auto">
          {/* CORTEX Brand Header */}
          <div className="space-y-1.5 pb-3 border-b border-[var(--astra-border)]">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-[var(--cortex-accent)]" />
              <h1 className="font-bold text-sm text-[var(--cortex-accent)] font-mono tracking-wider">
                CORTEX AI
              </h1>
            </div>
            <p className="text-xs text-[var(--astra-text-secondary)] italic">
              Intelligence beyond information.
            </p>
          </div>

          {/* Assistant Protocol & Scope */}
          <div className="p-3 rounded bg-[var(--astra-bg-elevated)] border border-[var(--astra-border)] space-y-2 text-xs">
            <span className="font-mono text-[10px] text-[var(--astra-text-muted)] uppercase font-semibold">
              OPERATIONAL DIRECTIVES
            </span>
            <ul className="space-y-1.5 text-[11px] text-[var(--astra-text-secondary)]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--cortex-accent)] shrink-0 mt-0.5" />
                <span>Grounded strictly in verified ASTRA domain records</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--cortex-accent)] shrink-0 mt-0.5" />
                <span>Separates observed facts from analytical inferences</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--cortex-accent)] shrink-0 mt-0.5" />
                <span>Explicit uncertainty and missing-coverage declarations</span>
              </li>
            </ul>
          </div>

          {/* Ephemeral Privacy Notice */}
          <div className="p-3 rounded bg-[var(--astra-bg-elevated)] border border-[var(--astra-border)] space-y-1.5 text-xs text-[var(--astra-text-secondary)]">
            <div className="flex items-center gap-1.5 text-green-400 font-mono text-[10px] font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>ANONYMOUS & EPHEMERAL</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Sessions are maintained only in active browser memory. Inquiries and reasoning traces are permanently purged upon navigating away.
            </p>
          </div>

          {/* Prompt Templates */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[var(--astra-text-muted)] uppercase font-semibold">
              SAMPLE INQUIRIES
            </span>
            <div className="space-y-1.5">
              {samplePrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="w-full text-left p-2 rounded bg-[var(--astra-bg-elevated)] border border-[var(--astra-border)] hover:border-[var(--cortex-accent)]/50 text-[11px] text-[var(--astra-text-secondary)] hover:text-white transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate pr-1">{p}</span>
                  <ArrowRight className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 text-[var(--cortex-accent)] transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Active Reasoning Stream Column */}
        <div className="flex-1 flex flex-col min-w-0 bg-[var(--astra-bg-base)]">
          {/* Stream Toolbar */}
          <div className="flex h-11 items-center justify-between px-4 border-b border-[var(--astra-border)] bg-[var(--astra-bg-surface)]">
            <div className="flex items-center gap-2">
              <Badge variant="cortex">SYNTHESIS SESSION</Badge>
              <span className="text-[11px] font-mono text-[var(--astra-text-muted)]">
                {messages.length > 0 ? `${messages.length} exchanges` : 'Standby'}
              </span>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 text-xs text-[var(--astra-text-secondary)] hover:text-red-400"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                <span>Clear Session</span>
              </Button>
            )}
          </div>

          {/* Conversation & Findings Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--cortex-accent-muted)] border border-[var(--cortex-accent)]/30 shadow-[0_0_20px_rgba(77,159,255,0.2)]">
                  <BrainCircuit className="h-8 w-8 text-[var(--cortex-accent)]" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-sm font-bold font-mono text-[var(--astra-text-primary)]">
                    CORTEX REASONING ENGINE ACTIVE
                  </h2>
                  <p className="text-xs text-[var(--astra-text-secondary)] leading-relaxed">
                    Submit natural-language questions to cross-examine vessels, aircraft, satellites, and events currently indexed within the ASTRA situational database.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-2">
                  {samplePrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => handleSend(p)}
                      className="p-2.5 rounded bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] hover:border-[var(--cortex-accent)] text-left text-xs text-[var(--astra-text-secondary)] hover:text-[var(--astra-text-primary)] transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col space-y-2 ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* User Question */}
                  {msg.role === 'user' ? (
                    <div className="max-w-xl p-3 rounded-lg bg-[var(--astra-bg-elevated)] border border-[var(--astra-border-bright)] text-xs text-[var(--astra-text-primary)] font-medium">
                      {msg.content}
                    </div>
                  ) : (
                    /* Assistant Structured Response */
                    <div className="max-w-3xl w-full p-4 rounded-lg bg-[var(--astra-bg-surface)] border border-[var(--cortex-accent)]/30 space-y-4 shadow-lg">
                      {/* Demo Badge Callout */}
                      <div className="p-2.5 rounded bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-purple-400 shrink-0" />
                          <span className="font-mono font-semibold text-[11px] text-purple-300">
                            {msg.response?.demoLabel || 'DEMONSTRATION REASONING RESPONSE'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-purple-300/80">
                          {formatDateTime(msg.timestamp)}
                        </span>
                      </div>

                      {/* Summary Section */}
                      <div className="space-y-1">
                        <span className="font-mono text-[10px] text-[var(--cortex-accent)] uppercase tracking-wider font-semibold">
                          SYNTHESIS SUMMARY
                        </span>
                        <p className="text-xs text-[var(--astra-text-primary)] leading-relaxed">
                          {msg.content}
                        </p>
                      </div>

                      {/* Structured Findings List */}
                      {msg.response?.findings && msg.response.findings.length > 0 && (
                        <div className="space-y-2.5 pt-2 border-t border-[var(--astra-border)]">
                          <span className="font-mono text-[10px] text-[var(--astra-text-muted)] uppercase tracking-wider font-semibold">
                            EVALUATED FINDINGS & UNCERTAINTY INDICATORS
                          </span>
                          <div className="grid grid-cols-1 gap-2">
                            {msg.response.findings.map((f, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded border text-xs space-y-2 ${
                                  f.type === 'fact'
                                    ? 'border-blue-500/30 bg-blue-950/15 text-blue-200'
                                    : f.type === 'uncertainty'
                                    ? 'border-amber-500/30 bg-amber-950/15 text-amber-200'
                                    : f.type === 'inference'
                                    ? 'border-purple-500/30 bg-purple-950/15 text-purple-200'
                                    : 'border-[var(--astra-border)] bg-[var(--astra-bg-elevated)] text-[var(--astra-text-primary)]'
                                }`}
                              >
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                  <span className="font-bold uppercase tracking-wider">
                                    [{f.type.toUpperCase()}]
                                  </span>
                                  {f.confidence && (
                                    <span className="text-[var(--astra-text-muted)]">
                                      CONFIDENCE: {f.confidence.toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <p className="leading-relaxed text-[11px]">{f.content}</p>
                                {f.sourceRef && (
                                  <div className="pt-1 border-t border-white/5">
                                    <SourceTag source={f.sourceRef} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Thinking / Synthesizing Indicator */}
            {loading && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--astra-bg-surface)] border border-[var(--cortex-accent)]/20 max-w-sm">
                <div className="flex items-center gap-1.5">
                  <span className="cortex-dot" />
                  <span className="cortex-dot" />
                  <span className="cortex-dot" />
                </div>
                <span className="font-mono text-xs text-[var(--cortex-accent)]">
                  Evaluating situational queries...
                </span>
              </div>
            )}
          </div>

          {/* Bottom Query Input Tray */}
          <div className="p-3 border-t border-[var(--astra-border)] bg-[var(--astra-bg-surface)]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 max-w-4xl mx-auto"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask CORTEX to examine tracks, cross-domain anomalies, or source validity..."
                className="flex-1 h-9 px-3 text-xs bg-[var(--astra-bg-base)] border border-[var(--astra-border)] rounded text-[var(--astra-text-primary)] placeholder:text-[var(--astra-text-muted)] focus:outline-none focus:border-[var(--cortex-accent)] font-mono transition-colors"
              />
              <Button
                type="submit"
                variant="cortex"
                size="default"
                disabled={loading || !query.trim()}
                className="font-mono text-xs px-4"
              >
                <Send className="h-3.5 w-3.5 mr-1" />
                <span>Submit</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
