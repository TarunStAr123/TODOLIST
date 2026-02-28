import { useState, useRef, useEffect, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Tag, ClipboardList } from 'lucide-react';
import type { Task } from '../../pages/DashboardPage';

interface User {
    name: string;
    email: string;
}

interface TaskBoardProps {
    user: User;
    selectedDate: string;          // YYYY-MM-DD — from DashboardPage
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const LS_KEY = 'taskflow_tasks';

const TAG_OPTIONS = [
    { label: 'General', textColor: 'text-slate-600', bgColor: 'bg-slate-100' },
    { label: 'Marketing', textColor: 'text-orange-600', bgColor: 'bg-orange-100' },
    { label: 'Content', textColor: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: 'Design', textColor: 'text-pink-600', bgColor: 'bg-pink-100' },
    { label: 'Product', textColor: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Meeting', textColor: 'text-blue-600', bgColor: 'bg-blue-100' },
];

function getTagStyle(label: string) {
    return TAG_OPTIONS.find((t) => t.label === label) ?? TAG_OPTIONS[0];
}

/** Format "2026-02-28" → "Saturday, February 28" */
function formatDisplayDate(ymd: string): string {
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
}

/** Format "2026-02-28" → "February 28" (short, for empty state message) */
function formatShortDate(ymd: string): string {
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
        month: 'long',
        day: 'numeric',
    });
}

function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

function saveTasks(tasks: Task[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks.filter((t) => !t.removing)));
}

export default function TaskBoard({ user, selectedDate, tasks, setTasks }: TaskBoardProps) {
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [inputTag, setInputTag] = useState(TAG_OPTIONS[0].label); // "General" default
    const [checkAnimId, setCheckAnimId] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Persist whenever tasks changes
    useEffect(() => {
        saveTasks(tasks);
    }, [tasks]);

    // Focus input on reveal
    useEffect(() => {
        if (showInput) setTimeout(() => inputRef.current?.focus(), 50);
    }, [showInput]);

    // Reset input tag to General when date changes
    useEffect(() => {
        setInputTag(TAG_OPTIONS[0].label);
        setInputValue('');
        setShowInput(false);
    }, [selectedDate]);

    // Tasks for the selected date only
    const dayTasks = tasks.filter((t) => t.date === selectedDate && !t.removing);
    const pendingCount = dayTasks.filter((t) => !t.done).length;

    const addTask = useCallback(() => {
        const title = inputValue.trim();
        if (!title) return;

        const newTask: Task = {
            id: `${Date.now()}-${Math.random()}`,
            title,
            tag: inputTag,
            done: false,
            date: selectedDate,
        };
        setTasks((prev) => [newTask, ...prev]);
        setInputValue('');
        setShowInput(false);
    }, [inputValue, inputTag, selectedDate, setTasks]);

    const handleInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') addTask();
        if (e.key === 'Escape') { setShowInput(false); setInputValue(''); }
    };

    const toggleTask = (id: string) => {
        setCheckAnimId(id);
        setTimeout(() => setCheckAnimId(null), 280);
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    };

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));
        setTimeout(() => setTasks((prev) => prev.filter((t) => t.id !== id)), 290);
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-7 animate-fade-up">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-0.5">
                            Good {getGreeting()},{' '}
                            <span className="text-primary">{user.name.split(' ')[0]}</span>
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">{formatDisplayDate(selectedDate)}</p>
                    </div>
                    {pendingCount > 0 && (
                        <div className="shrink-0 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">
                            {pendingCount} left
                        </div>
                    )}
                </div>
            </div>

            {/* Task card */}
            <div
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-up"
                style={{ animationDelay: '0.05s' }}
            >
                {/* Card header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800 text-lg">Today's Tasks</h2>
                    <button
                        onClick={() => setShowInput(true)}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 active:scale-95 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        Add Task
                    </button>
                </div>

                <div className="px-4 py-2">
                    {/* Inline add-task row */}
                    {showInput && (
                        <div className="animate-task-in mb-2 flex flex-col gap-2 bg-slate-50 border border-primary/30 rounded-xl p-4">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleInputKey}
                                placeholder="What needs to be done?"
                                className="w-full bg-transparent text-slate-800 font-medium text-sm placeholder-slate-400 outline-none"
                            />
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                {/* Tag selector */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <Tag size={13} className="text-slate-400 shrink-0" />
                                    {TAG_OPTIONS.map((t) => (
                                        <button
                                            key={t.label}
                                            type="button"
                                            onClick={() => setInputTag(t.label)}
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-150 border ${inputTag === t.label
                                                    ? `${t.bgColor} ${t.textColor} border-current scale-105`
                                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                                                }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Confirm / Cancel */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => { setShowInput(false); setInputValue(''); }}
                                        className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-150"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={addTask}
                                        disabled={!inputValue.trim()}
                                        className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Task list or empty state */}
                    {dayTasks.length === 0 && !showInput ? (
                        <EmptyState date={selectedDate} onAdd={() => setShowInput(true)} />
                    ) : (
                        <ul className="divide-y divide-slate-50 py-1">
                            {dayTasks.map((task) => {
                                const style = getTagStyle(task.tag);
                                return (
                                    <li
                                        key={task.id}
                                        className={`group flex items-center gap-4 py-3 px-2 rounded-xl transition-all duration-200 hover:bg-slate-50 ${task.removing ? 'animate-task-out' : 'animate-task-in'
                                            }`}
                                    >
                                        {/* Checkbox — large hit target (Fitts' Law) */}
                                        <button
                                            onClick={() => toggleTask(task.id)}
                                            aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
                                            className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-primary/10 ${checkAnimId === task.id ? 'animate-check-pop' : ''
                                                }`}
                                        >
                                            {task.done ? (
                                                <CheckCircle2 size={23} className="text-primary" />
                                            ) : (
                                                <Circle size={23} className="text-slate-300 group-hover:text-primary/50 transition-colors" />
                                            )}
                                        </button>

                                        {/* Title + tag */}
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className={`text-sm font-medium transition-all duration-300 ${task.done ? 'line-through text-slate-400' : 'text-slate-800'
                                                    }`}
                                            >
                                                {task.title}
                                            </p>
                                            <span
                                                className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${task.done ? 'bg-slate-100 text-slate-400' : `${style.bgColor} ${style.textColor}`
                                                    }`}
                                            >
                                                {task.tag}
                                            </span>
                                        </div>

                                        {/* Delete */}
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            aria-label="Delete task"
                                            className="opacity-0 group-hover:opacity-100 shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 active:scale-90"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

function EmptyState({ date, onAdd }: { date: string; onAdd: () => void }) {
    const shortDate = formatShortDate(date);
    return (
        <div className="flex flex-col items-center py-14 px-6 text-center animate-fade-up">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <ClipboardList size={28} className="text-primary" />
            </div>
            <h3 className="font-bold text-slate-700 text-base mb-1">No tasks for {shortDate}</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
                Add one to stay productive.
            </p>
            <button
                onClick={onAdd}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all duration-200"
            >
                <Plus size={16} strokeWidth={2.5} />
                Add a task
            </button>
        </div>
    );
}
