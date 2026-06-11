import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listQuotes, submitQuote } from '@/lib/api';
import {
  AISLES,
  SAMPLE_QUOTES,
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_STYLES,
  aisleBySlug,
  type SampleQuote,
  type QuoteStatus,
} from '@/lib/mallData';

export default function QuotesPage() {
  const [searchParams] = useSearchParams();
  const aisleParam = searchParams.get('aisle') ?? '';

  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('100');
  const [unit, setUnit] = useState('units');
  const [aisle, setAisle] = useState(aisleBySlug(aisleParam)?.slug ?? '');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const [quotes, setQuotes] = useState<SampleQuote[]>(SAMPLE_QUOTES);
  const [demoList, setDemoList] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listQuotes()
      .then(({ quotes: remote }) => {
        if (cancelled || remote.length === 0) return;
        setQuotes(
          remote.map((q) => ({
            id: q.id,
            description: q.request?.description ?? q.items.map((i) => i.name).join(', '),
            quantity: q.request?.quantity ?? q.items.reduce((sum, i) => sum + i.qty, 0),
            unit: q.request?.unit ?? 'units',
            aisle: q.request?.aisle ?? '',
            status: q.status as QuoteStatus,
            total: q.total || undefined,
            createdAt: q.createdAt.slice(0, 10),
          }))
        );
        setDemoList(false);
      })
      .catch(() => {
        // Unauthenticated / offline — keep the sample list (demo mode).
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitting(true);
    setConfirmation(null);

    const request = {
      description: description.trim(),
      quantity: Number(quantity) || 1,
      unit,
      aisle: aisle || undefined,
      deadline: deadline || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      const res = await submitQuote({ request });
      // Only record + confirm when the server actually accepted the RFQ.
      setQuotes((prev) => [
        {
          id: res.quote.id,
          description: request.description,
          quantity: request.quantity,
          unit: request.unit,
          aisle: request.aisle ?? '',
          status: 'submitted',
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
      setConfirmation(res.message);
      setDescription('');
      setNotes('');
    } catch {
      // Be honest: nothing was persisted. Tell the user it didn't go through.
      setConfirmation(
        'error:We couldn’t submit your request — please sign in, or try again in a moment.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--os-bg)] text-[var(--os-text)]">
      <div className="px-8 pt-12 pb-8 border-b border-[var(--os-border)]">
        <h1 className="text-3xl font-black tracking-tight mb-2">Request a Quote</h1>
        <p className="text-[var(--os-text-secondary)] font-medium">
          Tell us what you need. An GrahmOS agent prices it across the mall and comes back with the best offer.
        </p>
      </div>

      <div className="flex-1 p-8 max-w-[1000px] mx-auto w-full">
        {/* RFQ form */}
        <form onSubmit={onSubmit} className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-8 mb-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">
                What do you need?
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 500 branded canvas totes, 1-color print, delivered by end of month"
                className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[var(--os-blue)] resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[var(--os-blue)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-3 px-4 text-sm focus:outline-none"
                >
                  {['units', 'pieces', 'boxes', 'cases', 'sets', 'pallets', 'deliveries', 'weeks'].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">Aisle</label>
                <select
                  value={aisle}
                  onChange={(e) => setAisle(e.target.value)}
                  className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-3 px-4 text-sm focus:outline-none"
                >
                  <option value="">Let GrahmOS decide</option>
                  {AISLES.map((a) => (
                    <option key={a.slug} value={a.slug}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">Needed by</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[var(--os-blue)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[var(--os-text-secondary)]">Notes (optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Budget, specs, delivery address, anything else"
                className="w-full bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[var(--os-blue)] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[var(--os-blue)] text-white rounded-xl font-black text-lg hover:brightness-110 transition-all disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit quote request'}
            </button>

            {confirmation && (() => {
              const isError = confirmation.startsWith('error:');
              const text = isError ? confirmation.slice(6) : confirmation;
              return (
                <div
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold border ${
                    isError
                      ? 'bg-[var(--os-red)]/10 border-[var(--os-red)]/30 text-[var(--os-red)]'
                      : 'bg-[var(--os-green)]/10 border-[var(--os-green)]/30 text-[var(--os-green)]'
                  }`}
                >
                  <span>{isError ? '⚠' : '✓'}</span>
                  <span>{text}</span>
                </div>
              );
            })()}
          </div>
        </form>

        {/* My quotes */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black">My quote requests</h2>
          {demoList && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--os-text-tertiary)] bg-[var(--os-surface-2)] border border-[var(--os-border)] rounded-full px-3 py-1">
              Sample data
            </span>
          )}
        </div>
        <div className="space-y-3">
          {quotes.map((quote) => {
            const quoteAisle = aisleBySlug(quote.aisle);
            return (
              <div
                key={quote.id}
                className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm mb-1 truncate">{quote.description}</div>
                  <div className="text-xs text-[var(--os-text-secondary)] font-medium">
                    {quote.quantity.toLocaleString()} {quote.unit}
                    {quoteAisle ? ` · ${quoteAisle.icon} ${quoteAisle.name}` : ''} · {quote.createdAt}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {quote.total != null && <div className="font-black text-sm">${quote.total.toLocaleString()}</div>}
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${QUOTE_STATUS_STYLES[quote.status]}`}>
                    {QUOTE_STATUS_LABELS[quote.status]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
