import { Undo2 } from 'lucide-react';

interface UndoToastProps {
    visible: boolean;
    taskTitle: string;
    onUndo: () => void;
    onDismiss: () => void;
}

export default function UndoToast({ visible, taskTitle, onUndo, onDismiss }: UndoToastProps) {
    return (
        <div
            role="alert"
            aria-live="polite"
            className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-3
        px-4 py-3 min-w-[280px] max-w-sm
        bg-slate-800 dark:bg-slate-700
        border border-slate-700 dark:border-slate-600
        rounded-xl shadow-2xl
        pointer-events-auto select-none
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
        >
            {/* Message */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white leading-none mb-0.5">Task deleted</p>
                <p className="text-xs text-slate-400 truncate max-w-[180px]">{taskTitle}</p>
            </div>

            {/* Undo button */}
            <button
                onClick={onUndo}
                className="flex items-center gap-1.5 text-primary hover:text-primary/80 font-semibold text-sm transition-colors shrink-0 px-2 py-1 rounded-lg hover:bg-primary/10"
                aria-label="Undo task deletion"
            >
                <Undo2 size={14} strokeWidth={2.5} />
                Undo
            </button>

            {/* Dismiss */}
            <button
                onClick={onDismiss}
                className="text-slate-500 hover:text-slate-300 transition-colors text-lg leading-none px-1 shrink-0"
                aria-label="Dismiss"
            >
                ×
            </button>
        </div>
    );
}
