import { useState, useRef, useEffect, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { Plus, CheckCircle2, Circle, Tag, ClipboardList, Search } from 'lucide-react';
import type { Task } from '../../pages/DashboardPage';

interface User { name: string; email: string; }
interface TaskBoardProps {
    user: User;
    selectedDate: string;
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    onTaskComplete?: () => void;
    onDeleteTask: (id: string) => void;
    triggerAdd?: number;
}

const TAG_OPTIONS = [
    { label: 'General', textColor: 'text-slate-600', bgColor: 'bg-slate-100', darkTextColor: 'dark:text-slate-300', darkBgColor: 'dark:bg-slate-700' },
    { label: 'Marketing', textColor: 'text-orange-600', bgColor: 'bg-orange-100', darkTextColor: 'dark:text-orange-400', darkBgColor: 'dark:bg-orange-900/40' },
    { label: 'Content', textColor: 'text-purple-600', bgColor: 'bg-purple-100', darkTextColor: 'dark:text-purple-400', darkBgColor: 'dark:bg-purple-900/40' },
    { label: 'Design', textColor: 'text-pink-600', bgColor: 'bg-pink-100', darkTextColor: 'dark:text-pink-400', darkBgColor: 'dark:bg-pink-900/40' },
    { label: 'Product', textColor: 'text-green-600', bgColor: 'bg-green-100', darkTextColor: 'dark:text-green-400', darkBgColor: 'dark:bg-green-900/40' },
    { label: 'Meeting', textColor: 'text-blue-600', bgColor: 'bg-blue-100', darkTextColor: 'dark:text-blue-400', darkBgColor: 'dark:bg-blue-900/40' },
];

function getTagStyle(label: string) {
    return TAG_OPTIONS.find((t) => t.label === label) ?? TAG_OPTIONS[0];
}

function formatDisplayDate(ymd: string): string {
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatShortDate(ymd: string): string {
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-IN', { month: 'long', day: 'numeric' });
}

function formatCardHeading(ymd: string): string {
    const today = new Date();
    const todayYMD = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (ymd === todayYMD) return 'Today';
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
}

function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

/** Smart empty state message */
function getEmptyMessage(ymd: string): { heading: string; body: string } {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [y, m, d] = ymd.split('-').map(Number);
    const sel = new Date(y, m - 1, d); sel.setHours(0, 0, 0, 0);
    const diff = sel.getTime() - today.getTime();
    const shortDate = formatShortDate(ymd);
    if (diff === 0) return { heading: 'No tasks for today', body: 'Add one to stay productive.' };
    if (diff > 0) return { heading: `Nothing planned for ${shortDate}`, body: 'Plan ahead — add a task.' };
    return { heading: `No tasks on ${shortDate}`, body: 'Nothing was completed on this day.' };
}

export default function TaskBoard({ user, selectedDate, tasks, setTasks, onTaskComplete, onDeleteTask, triggerAdd }: TaskBoardProps) {
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [inputTag, setInputTag] = useState(TAG_OPTIONS[0].label);
    const [checkAnimId, setCheckAnimId] = useState<string | null>(null);
    const [shakeInput, setShakeInput] = useState(false);
    const [emptyMsg, setEmptyMsg] = useState(false);
    const [completedFeedback, setCompletedFeedback] = useState(false);

    // Search state (debounced)
    const [searchRaw, setSearchRaw] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => { if (showInput) setTimeout(() => inputRef.current?.focus(), 50); }, [showInput]);
    useEffect(() => { setInputTag(TAG_OPTIONS[0].label); setInputValue(''); setShowInput(false); setSearchRaw(''); setSearchQuery(''); }, [selectedDate]);

    // triggerAdd counter from keyboard N
    const prevTriggerAdd = useRef(0);
    useEffect(() => {
        if (triggerAdd && triggerAdd !== prevTriggerAdd.current) {
            prevTriggerAdd.current = triggerAdd;
            setShowInput(true);
        }
    }, [triggerAdd]);

    // Debounce search
    function handleSearchChange(val: string) {
        setSearchRaw(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setSearchQuery(val), 200);
    }
    useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

    const dayTasks = tasks.filter((t) => t.date === selectedDate && !t.removing);
    const filteredTasks = searchQuery.trim()
        ? dayTasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : dayTasks;
    const pendingCount = dayTasks.filter((t) => !t.done).length;

    const addTask = useCallback(() => {
        const title = inputValue.trim();
        if (!title) {
            // Shake + inline message
            setShakeInput(true);
            setEmptyMsg(true);
            setTimeout(() => setShakeInput(false), 400);
            setTimeout(() => setEmptyMsg(false), 2000);
            inputRef.current?.focus();
            return;
        }
        const newTask: Task = { id: `${Date.now()}-${Math.random()}`, title, tag: inputTag, done: false, date: selectedDate };
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
        setTasks((prev) => {
            const wasIncomplete = prev.find((t) => t.id === id && !t.done);
            if (wasIncomplete) {
                onTaskComplete?.();
                setCompletedFeedback(true);
                setTimeout(() => setCompletedFeedback(false), 1800);
            }
            return prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
        });
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-7 animate-fade-up">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-0.5">
                            Good {getGreeting()},{' '}
                            <span className="text-primary">{user.name.split(' ')[0]}</span>
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{formatDisplayDate(selectedDate)}</p>
                    </div>
                    {pendingCount > 0 && (
                        <div
                            className="shrink-0 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 text-primary px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap"
                            aria-label={`${pendingCount} tasks remaining`}
                        >
                            {pendingCount} left
                        </div>
                    )}
                </div>
            </div>

            {/* Task card */}
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden animate-fade-up transition-colors duration-300"
                style={{ animationDelay: '0.05s' }}
            >
                {/* Card header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                    <div>
                        <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-none">
                            {formatCardHeading(selectedDate)}
                        </h2>
                        <div className="h-4 mt-1">
                            {completedFeedback ? (
                                <span className="inline-block text-[10px] font-semibold text-green-500 animate-fade-out-msg">
                                    ✓ Task completed
                                </span>
                            ) : !showInput ? (
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                    Press <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[9px] font-mono">N</kbd> to add
                                </span>
                            ) : null}
                        </div>
                    </div>
                    <button
                        onClick={() => setShowInput(true)}
                        aria-label="Add new task"
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 active:scale-95 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        Add Task
                    </button>
                </div>

                {/* Search bar */}
                <div className="px-4 pt-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                        <input
                            ref={searchRef}
                            type="search"
                            value={searchRaw}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search tasks…"
                            aria-label="Search tasks"
                            className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-150"
                        />
                    </div>
                </div>

                <div className="px-4 py-2">
                    {/* Inline add-task row */}
                    {showInput && (
                        <div className="animate-task-in mb-2 flex flex-col gap-2 bg-slate-50 dark:bg-slate-700/50 border border-primary/30 dark:border-primary/40 rounded-xl p-4">
                            <div className={shakeInput ? 'animate-shake' : ''}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleInputKey}
                                    placeholder="What needs to be done?"
                                    aria-label="New task title"
                                    aria-required="true"
                                    className="w-full bg-transparent text-slate-800 dark:text-slate-100 font-medium text-sm placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-0"
                                />
                                {emptyMsg && (
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 animate-fade-out-msg" role="alert">
                                        Task cannot be empty.
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <Tag size={13} className="text-slate-400 dark:text-slate-500 shrink-0" aria-hidden="true" />
                                    {TAG_OPTIONS.map((t) => (
                                        <button
                                            key={t.label}
                                            type="button"
                                            onClick={() => setInputTag(t.label)}
                                            aria-label={`Tag: ${t.label}`}
                                            aria-pressed={inputTag === t.label}
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-150 border focus:outline-none focus:ring-2 focus:ring-primary/40 ${inputTag === t.label
                                                    ? `${t.bgColor} ${t.darkBgColor} ${t.textColor} ${t.darkTextColor} border-current scale-105`
                                                    : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-slate-400'
                                                }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => { setShowInput(false); setInputValue(''); }}
                                        className="px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={addTask}
                                        aria-label="Confirm add task"
                                        className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Task list or empty state */}
                    {filteredTasks.length === 0 && !showInput ? (
                        searchQuery.trim() ? (
                            <NoResults query={searchQuery} onClear={() => { setSearchRaw(''); setSearchQuery(''); }} />
                        ) : (
                            <EmptyState ymd={selectedDate} onAdd={() => setShowInput(true)} />
                        )
                    ) : (
                        <ul className="divide-y divide-slate-50 dark:divide-slate-700/50 py-1" aria-label="Task list">
                            {filteredTasks.map((task) => {
                                const style = getTagStyle(task.tag);
                                return (
                                    <li
                                        key={task.id}
                                        className={`group flex items-center gap-4 py-3 px-2 rounded-xl transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/40 ${task.removing ? 'animate-task-out' : 'animate-task-in'
                                            } ${task.done ? 'opacity-75' : ''}`}
                                    >
                                        <button
                                            onClick={() => toggleTask(task.id)}
                                            aria-label={task.done ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
                                            aria-pressed={task.done}
                                            className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-primary/10 dark:hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/40 ${checkAnimId === task.id ? 'animate-check-pop' : ''}`}
                                        >
                                            {task.done
                                                ? <CheckCircle2 size={23} className="text-primary" />
                                                : <Circle size={23} className="text-slate-300 dark:text-slate-600 group-hover:text-primary/50 transition-colors" />
                                            }
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium transition-all duration-300 ${task.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                                                {task.title}
                                            </p>
                                            <span
                                                className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${task.done
                                                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                                                        : `${style.bgColor} ${style.darkBgColor} ${style.textColor} ${style.darkTextColor}`
                                                    }`}
                                                aria-label={`Category: ${task.tag}`}
                                            >
                                                {task.tag}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => onDeleteTask(task.id)}
                                            aria-label={`Delete task: ${task.title}`}
                                            className="opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                                            </svg>
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

function EmptyState({ ymd, onAdd }: { ymd: string; onAdd: () => void }) {
    const { heading, body } = getEmptyMessage(ymd);
    return (
        <div className="flex flex-col items-center py-14 px-6 text-center animate-fade-up">
            <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-4" aria-hidden="true">
                <ClipboardList size={28} className="text-primary" />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base mb-1">{heading}</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-6 max-w-xs">{body}</p>
            <button
                onClick={onAdd}
                aria-label="Add a task for this date"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
                <Plus size={16} strokeWidth={2.5} />
                Add a task
            </button>
        </div>
    );
}

function NoResults({ query, onClear }: { query: string; onClear: () => void }) {
    return (
        <div className="flex flex-col items-center py-10 px-6 text-center">
            <Search size={28} className="text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                No results for <span className="text-primary">"{query}"</span>
            </p>
            <button onClick={onClear} className="text-xs text-slate-400 hover:text-primary transition-colors mt-1">
                Clear search
            </button>
        </div>
    );
}
