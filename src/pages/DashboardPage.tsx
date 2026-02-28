import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import TaskBoard from '../components/dashboard/TaskBoard';
import MiniCalendar from '../components/dashboard/MiniCalendar';

/** Shared task type — imported by TaskBoard too */
export interface Task {
    id: string;
    title: string;
    tag: string;
    done: boolean;
    date: string;   // YYYY-MM-DD
    removing?: boolean;
}

const LS_KEY = 'taskflow_tasks';

function loadTasks(): Task[] {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function todayYMD(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState<string>(todayYMD());
    const [tasks, setTasks] = useState<Task[]>(loadTasks);

    // Set of dates that have at least one task — feeds the calendar dots
    const taskDates = useMemo<Set<string>>(
        () => new Set(tasks.filter((t) => !t.removing).map((t) => t.date)),
        [tasks]
    );

    return (
        <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
            <Sidebar user={user!} />

            {/* Body: Calendar panel + Task board */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left: Mini Calendar */}
                <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-r border-slate-200 bg-white/60 backdrop-blur-sm px-4 py-8 gap-6 overflow-y-auto shrink-0">
                    <MiniCalendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        taskDates={taskDates}
                    />
                </aside>

                {/* Right: Task board */}
                <main className="flex-1 overflow-y-auto">
                    <TaskBoard
                        user={user!}
                        selectedDate={selectedDate}
                        tasks={tasks}
                        setTasks={setTasks}
                    />
                </main>
            </div>
        </div>
    );
}
