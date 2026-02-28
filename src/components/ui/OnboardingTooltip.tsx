import { useEffect, useState } from 'react';
import { CalendarDays, X } from 'lucide-react';

const LS_KEY = 'taskflow_onboarded';
const AUTO_HIDE_MS = 6000;

export default function OnboardingTooltip() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (localStorage.getItem(LS_KEY)) return; // already onboarded
        // Short delay so dashboard mounts first
        const show = setTimeout(() => setVisible(true), 800);
        const hide = setTimeout(() => dismiss(), 800 + AUTO_HIDE_MS);
        return () => { clearTimeout(show); clearTimeout(hide); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function dismiss() {
        setVisible(false);
        localStorage.setItem(LS_KEY, '1');
    }

    if (!visible) return null;

    return (
        <div
            className={`
        fixed left-[19rem] top-32 z-50
        max-w-[230px]
        bg-slate-900 dark:bg-slate-700
        text-white rounded-xl
        shadow-2xl border border-slate-700 dark:border-slate-600
        px-4 py-3
        transition-all duration-400 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}
            role="tooltip"
            aria-label="Onboarding tip: select a date to view or add tasks"
        >
            {/* Arrow pointing left toward calendar panel */}
            <div className="absolute -left-2 top-5 w-3 h-3 bg-slate-900 dark:bg-slate-700 border-l border-b border-slate-700 dark:border-slate-600 rotate-45" />

            <div className="flex items-start gap-2.5">
                <div className="shrink-0 mt-0.5 w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center">
                    <CalendarDays size={15} className="text-primary" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold leading-snug">
                        Select a date to view or add tasks.
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                        Press <kbd className="px-1 py-0.5 bg-slate-700 dark:bg-slate-600 rounded text-[9px] font-mono">N</kbd> to quickly add, <kbd className="px-1 py-0.5 bg-slate-700 dark:bg-slate-600 rounded text-[9px] font-mono">T</kbd> to jump to today.
                    </p>
                </div>
                <button
                    onClick={dismiss}
                    className="shrink-0 text-slate-500 hover:text-white transition-colors -mt-0.5"
                    aria-label="Dismiss tip"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
