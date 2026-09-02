import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Tone = 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  tone: Tone;
}

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

type ToastFn = (message: string, tone?: Tone) => void;
type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ToastContext = createContext<ToastFn | null>(null);
const ConfirmContext = createContext<ConfirmFn | null>(null);

export const useToast = (): ToastFn => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <FeedbackProvider>');
  return ctx;
};

export const useConfirm = (): ConfirmFn => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used inside <FeedbackProvider>');
  return ctx;
};

const TOAST_MS = 4000;

const toneStyles: Record<Tone, { accent: string; icon: string }> = {
  success: { accent: '#20b2a6', icon: '✓' },
  error: { accent: '#ef4444', icon: '!' },
};

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [pending, setPending] = useState<{ options: ConfirmOptions; resolve: (ok: boolean) => void } | null>(null);
  const nextId = useRef(1);
  const timers = useRef<number[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts(list => list.filter(t => t.id !== id));
  }, []);

  const toast = useCallback<ToastFn>((message, tone = 'success') => {
    const id = nextId.current++;
    setToasts(list => [...list, { id, message, tone }]);
    timers.current.push(window.setTimeout(() => dismiss(id), TOAST_MS));
  }, [dismiss]);

  const confirm = useCallback<ConfirmFn>(
    options => new Promise<boolean>(resolve => setPending({ options, resolve })),
    []
  );

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const settle = useCallback((ok: boolean) => {
    setPending(current => {
      current?.resolve(ok);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') settle(false);
      if (e.key === 'Enter') settle(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [pending, settle]);

  return (
    <ToastContext.Provider value={toast}>
      <ConfirmContext.Provider value={confirm}>
        {children}

        {createPortal(
          <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 max-w-[calc(100vw-3rem)] w-80 pointer-events-none">
            {toasts.map(t => {
              const { accent, icon } = toneStyles[t.tone];
              return (
                <button
                  key={t.id}
                  onClick={() => dismiss(t.id)}
                  role="status"
                  aria-live="polite"
                  className="pointer-events-auto glass-card w-full text-left p-3.5 flex items-start gap-3 hover:border-white/20 transition-colors"
                  style={{ animation: 'fadeInUp 0.25s ease both', borderLeft: `3px solid ${accent}` }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-px"
                    style={{ background: `${accent}22`, color: accent }}
                  >
                    {icon}
                  </span>
                  <span className="text-[#e8edf2] text-sm leading-snug flex-1">{t.message}</span>
                </button>
              );
            })}
          </div>,
          document.body
        )}

        {pending && createPortal(
          <div
            className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => settle(false)}
          >
            <div
              role="alertdialog"
              aria-modal="true"
              aria-label={pending.options.title}
              className="glass-card w-full max-w-sm p-6"
              onClick={e => e.stopPropagation()}
              style={{ animation: 'fadeInUp 0.25s ease both' }}
            >
              <h3 className="text-[#e8edf2] font-bold text-lg">{pending.options.title}</h3>
              {pending.options.message && (
                <p className="text-[#6b7fa3] text-sm mt-2 leading-relaxed">{pending.options.message}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => settle(false)}
                  className="btn-outline w-full sm:flex-1 justify-center py-2 text-sm"
                >
                  {pending.options.cancelLabel ?? 'Cancel'}
                </button>
                <button
                  autoFocus
                  onClick={() => settle(true)}
                  className="w-full sm:flex-1 py-2 text-sm font-medium rounded-full border border-[#ef4444]/50 text-[#ef4444] hover:bg-[#ef4444]/15 transition-colors"
                >
                  {pending.options.confirmLabel ?? 'Delete'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
}
