import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import TaskBoard from '../components/dashboard/TaskBoard';
import MiniCalendar from '../components/dashboard/MiniCalendar';
import CompletionToast from '../components/ui/CompletionToast';
import UndoToast from '../components/ui/UndoToast';
import OnboardingTooltip from '../components/ui/OnboardingTooltip';

export interface Task {
    id: string;
    title: string;
    tag: string;
    done: boolean;
    date: string;
    removing?: boolean;
}

const LS_KEY = 'taskflow_tasks';

function loadTasks(): Task[] {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function toYMD(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function todayYMD(): string {
    return toYMD(new Date());
}

/** Count consecutive days (ending today going backwards) that have ≥1 completed task */
function calcStreak(tasks: Task[]): number {
    const doneDates = new Set(tasks.filter((t) => t.done).map((t) => t.date));
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 365; i++) {
        const ymd = toYMD(d);
        if (doneDates.has(ymd)) {
            streak++;
            d.setDate(d.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const today = todayYMD();
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const [tasks, setTasks] = useState<Task[]>(loadTasks);

    // ── Completion toast ──
    const [toastVisible, setToastVisible] = useState(false);

    // ── Undo delete state ──
    const [undoState, setUndoState] = useState<{ task: Task; index: number } | null>(null);
    const [undoVisible, setUndoVisible] = useState(false);
    const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Trigger add-task from keyboard ──
    const [triggerAdd, setTriggerAdd] = useState(0);

    // ── Save tasks to localStorage whenever they change ──
    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(tasks.filter((t) => !t.removing)));
    }, [tasks]);

    // ── Keyboard shortcuts ──
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement).tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') return;
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                setTriggerAdd((c) => c + 1);
            }
            if (e.key === 't' || e.key === 'T') {
                e.preventDefault();
                setSelectedDate(todayYMD());
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // ── Derived: day tasks, counts ──
    const dayTasks = useMemo(
        () => tasks.filter((t) => t.date === selectedDate && !t.removing),
        [tasks, selectedDate]
    );
    const totalTasks = dayTasks.length;
    const completedTasks = dayTasks.filter((t) => t.done).length;
    const scheduledCount = dayTasks.filter((t) => !t.done).length;
    const taskDates = useMemo<Set<string>>(
        () => new Set(tasks.filter((t) => !t.removing).map((t) => t.date)),
        [tasks]
    );

    // ── Streak ──
    const streak = useMemo(() => calcStreak(tasks), [tasks]);

    // ── Completion toast ──
    const showCompletionToast = useCallback(() => {
        setToastVisible(false);
        requestAnimationFrame(() => requestAnimationFrame(() => setToastVisible(true)));
    }, []);

    // ── Undo delete ──
    const handleDeleteTask = useCallback((id: string) => {
        const idx = tasks.findIndex((t) => t.id === id);
        const task = tasks[idx];
        if (!task) return;

        // Animate out
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));

        // Clear any existing undo timer
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);

        // Show undo toast
        setUndoState({ task, index: idx });
        setUndoVisible(true);

        // Auto-confirm delete after 3s
        undoTimerRef.current = setTimeout(() => {
            setTasks((prev) => prev.filter((t) => t.id !== id));
            setUndoVisible(false);
            setUndoState(null);
        }, 3000);
    }, [tasks]);

    const handleUndo = useCallback(() => {
        if (!undoState) return;
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        // Restore task (remove removing flag) back at original index
        setTasks((prev) => {
            const without = prev.filter((t) => t.id !== undoState.task.id);
            const restored = [...without];
            restored.splice(Math.min(undoState.index, restored.length), 0, {
                ...undoState.task,
                removing: false,
            });
            return restored;
        });
        setUndoVisible(false);
        setUndoState(null);
    }, [undoState]);

    const dismissUndo = useCallback(() => {
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        if (undoState) {
            setTasks((prev) => prev.filter((t) => t.id !== undoState.task.id));
        }
        setUndoVisible(false);
        setUndoState(null);
    }, [undoState]);

    // Cleanup timer on unmount
    useEffect(() => () => { if (undoTimerRef.current) clearTimeout(undoTimerRef.current); }, []);

    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans overflow-hidden transition-colors duration-300">
            <Sidebar
                user={user!}
                scheduledCount={scheduledCount}
                selectedDate={selectedDate}
                totalTasks={totalTasks}
                completedTasks={completedTasks}
                streak={streak}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* Left: Mini Calendar */}
                <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-r border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-8 gap-6 overflow-y-auto shrink-0 transition-colors duration-300">
                    <MiniCalendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        taskDates={taskDates}
                    />
                </aside>

                {/* Right: Task board */}
                <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
                    <TaskBoard
                        user={user!}
                        selectedDate={selectedDate}
                        tasks={tasks}
                        setTasks={setTasks}
                        onTaskComplete={showCompletionToast}
                        onDeleteTask={handleDeleteTask}
                        triggerAdd={triggerAdd}
                    />
                </main>
            </div>

            {/* Toasts */}
            <CompletionToast visible={toastVisible} onDismiss={() => setToastVisible(false)} />
            <UndoToast
                visible={undoVisible}
                taskTitle={undoState?.task.title ?? ''}
                onUndo={handleUndo}
                onDismiss={dismissUndo}
            />

            {/* One-time onboarding tooltip */}
            <OnboardingTooltip />
        </div>
    );
}
