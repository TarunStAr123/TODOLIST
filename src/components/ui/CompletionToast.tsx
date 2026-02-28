import { useEffect, useRef } from 'react';

interface CompletionToastProps {
    visible: boolean;
    onDismiss: () => void;
}

export default function CompletionToast({ visible, onDismiss }: CompletionToastProps) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (visible) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(onDismiss, 1800);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [visible, onDismiss]);

    return (
        <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-3
        px-4 py-3
        bg-white dark:bg-slate-800
        border border-slate-100 dark:border-slate-700
        border-l-4 border-l-primary
        rounded-xl
        shadow-lg dark:shadow-slate-900/50
        transition-all duration-300 ease-out
        select-none pointer-events-none
        ${visible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-3'
                }
      `}
        >
            {/* Rising arrow icon */}
            <div
                className={`
          flex items-center justify-center
          w-7 h-7 rounded-lg
          bg-primary/10 dark:bg-primary/20
          text-primary shrink-0
          transition-all duration-500 ease-in-out
          ${visible ? '-translate-y-1 opacity-100' : 'translate-y-1 opacity-0'}
        `}
            >
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M7 11V3M7 3L3.5 6.5M7 3L10.5 6.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Text */}
            <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-none mb-0.5">
                    Task completed
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-none">
                    Great work, keep going!
                </p>
            </div>
        </div>
    );
}
