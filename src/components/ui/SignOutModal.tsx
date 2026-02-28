import { useEffect, useRef } from 'react';

interface SignOutModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export default function SignOutModal({ onConfirm, onCancel }: SignOutModalProps) {
    const cancelRef = useRef<HTMLButtonElement>(null);
    const confirmRef = useRef<HTMLButtonElement>(null);

    // Auto-focus the Cancel button on open (safer default)
    useEffect(() => {
        cancelRef.current?.focus();
    }, []);

    // ESC closes; Tab traps focus inside modal
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { onCancel(); return; }
            if (e.key !== 'Tab') return;
            const focusable = [cancelRef.current, confirmRef.current].filter(Boolean) as HTMLElement[];
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onCancel]);

    return (
        /* Overlay */
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-fade-up"
            role="presentation"
            onClick={onCancel}           /* click outside = cancel */
        >
            {/* Dialog */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="signout-title"
                aria-describedby="signout-desc"
                className="w-[320px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-6 flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}   /* don't bubble to overlay */
            >
                <div>
                    <h2
                        id="signout-title"
                        className="text-base font-bold text-slate-900 dark:text-white mb-1"
                    >
                        Sign out?
                    </h2>
                    <p
                        id="signout-desc"
                        className="text-sm text-slate-500 dark:text-slate-400"
                    >
                        You will be returned to the homepage.
                    </p>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        ref={cancelRef}
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                        Cancel
                    </button>
                    <button
                        ref={confirmRef}
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 shadow-sm shadow-primary/20 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
