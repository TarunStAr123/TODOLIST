import { Inbox, CalendarCheck2, CheckCircle2, Circle, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

// ---------- Sidebar sub-components ----------

function MockNavItem({ icon, label, count, active = false }: {
    icon: React.ReactNode; label: string; count?: number; active?: boolean;
}) {
    return (
        <div className={`flex items-center justify-between px-2 py-2 rounded-lg text-xs transition-colors ${active
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-slate-500 hover:bg-slate-100'
            }`}>
            <div className="flex items-center gap-2">
                <span className={active ? 'text-primary' : 'text-slate-400'}>{icon}</span>
                <span>{label}</span>
            </div>
            {count !== undefined && count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${active ? 'bg-primary/20 text-primary' : 'text-slate-400'
                    }`}>{count}</span>
            )}
        </div>
    );
}

// Ring size constants for the mock
const R = 24;
const SW = 4;
const CIRC = 2 * Math.PI * R;
const SZ = (R + SW / 2 + 2) * 2;

function MockProgressRing({ pct }: { pct: number }) {
    const offset = CIRC - (pct / 100) * CIRC;
    return (
        <div className="flex flex-col items-center gap-1.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Daily Progress</p>
            <div className="flex flex-col items-center gap-2 w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3">
                <div className="relative">
                    <svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`} style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx={SZ / 2} cy={SZ / 2} r={R} fill="none" strokeWidth={SW} className="stroke-slate-200" />
                        <circle cx={SZ / 2} cy={SZ / 2} r={R} fill="none" strokeWidth={SW}
                            strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset}
                            className="stroke-primary" style={{ transition: 'stroke-dashoffset 400ms ease-in-out' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[9px] font-extrabold text-primary">{pct}%</span>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-700 leading-none">{pct}% Complete</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">4 Tasks · 3 Done</p>
                </div>
            </div>
        </div>
    );
}

// ---------- Mini calendar strip (purely decorative) ----------

function MockCalendar() {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    // Fake grid: 1-28 starting at Wednesday (offset 3)
    const cells: (number | null)[] = [...Array<null>(3).fill(null), ...Array.from({ length: 28 }, (_, i) => i + 1)];
    const today = 28; // highlight a "today" cell

    return (
        <div className="bg-white border-r border-slate-100 px-3 py-4 hidden lg:flex flex-col gap-3 w-[140px] shrink-0">
            <div className="flex items-center justify-between">
                <button className="text-slate-400 hover:text-primary transition-colors"><ChevronLeft size={12} /></button>
                <span className="text-[10px] font-bold text-slate-700">February 2026</span>
                <button className="text-slate-400 hover:text-primary transition-colors"><ChevronRight size={12} /></button>
            </div>
            <div className="grid grid-cols-7 gap-y-0.5">
                {days.map(d => (
                    <div key={d} className="text-center text-[8px] font-bold text-slate-400 uppercase py-0.5">{d}</div>
                ))}
                {cells.map((day, i) => {
                    if (!day) return <div key={`e-${i}`} />;
                    const isToday = day === today;
                    return (
                        <button key={day}
                            className={`h-6 w-full rounded-lg text-[9px] font-medium transition-colors ${isToday
                                    ? 'bg-primary text-white font-bold shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ---------- Task item ----------

function TaskItem({ title, tag, tagColor, done }: {
    title: string; tag: string; tagColor: string; done: boolean;
}) {
    return (
        <div className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all ${done ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-100 shadow-sm'
            }`}>
            <span className={`mt-0.5 shrink-0 ${done ? 'text-primary' : 'text-slate-300'}`}>
                {done ? <CheckCircle2 size={15} /> : <Circle size={15} />}
            </span>
            <div className="flex-1 min-w-0">
                <p className={`text-xs leading-snug ${done ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                    {title}
                </p>
                <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${done ? 'bg-slate-200 text-slate-400' : tagColor
                    }`}>
                    {tag}
                </span>
            </div>
        </div>
    );
}

// ---------- Main export ----------

export default function DashboardMock() {
    return (
        <div className="relative w-full max-w-[620px] h-[420px] bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden flex hover:-translate-y-1 transition-transform duration-500">

            {/* Sidebar */}
            <div className="w-[148px] bg-slate-50 border-r border-slate-100 p-3 flex flex-col gap-3 shrink-0">
                {/* Logo */}
                <div className="flex items-center gap-1.5 px-1 py-1 mb-1">
                    <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center shrink-0">
                        <div className="w-2.5 h-2.5 border-2 border-white rounded-sm" />
                    </div>
                    <span className="font-bold text-xs text-slate-800 tracking-tight">TaskFlow</span>
                </div>

                {/* Nav */}
                <div className="space-y-0.5">
                    <MockNavItem icon={<Inbox size={13} />} label="Inbox" />
                    <MockNavItem icon={<CalendarCheck2 size={13} />} label="Schedule — Today" active count={1} />
                </div>

                {/* Progress ring */}
                <div className="mt-1">
                    <MockProgressRing pct={75} />
                </div>
            </div>

            {/* Mini Calendar strip */}
            <MockCalendar />

            {/* Main task panel */}
            <div className="flex-1 flex flex-col bg-white p-4 min-w-0">
                {/* Heading */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">Today</h2>
                    <span className="text-[10px] font-semibold text-slate-400">Saturday, 28 Feb</span>
                </div>

                {/* Tasks */}
                <div className="flex-1 overflow-hidden space-y-2">
                    <TaskItem title="Review Q3 marketing strategy" tag="Marketing" tagColor="text-orange-600 bg-orange-100" done={false} />
                    <TaskItem title="Finalize landing page copy" tag="Content" tagColor="text-purple-600 bg-purple-100" done={false} />
                    <TaskItem title="Sync with design team" tag="Meeting" tagColor="text-blue-600 bg-blue-100" done={true} />
                    <TaskItem title="Update onboarding flow" tag="Product" tagColor="text-green-600 bg-green-100" done={true} />
                </div>

                {/* Add task CTA */}
                <button className="mt-3 flex items-center gap-1.5 text-primary text-xs font-semibold hover:opacity-75 transition-opacity">
                    <Plus size={14} strokeWidth={2.5} />
                    Add Task
                </button>
            </div>

            {/* Decorative glow */}
            <div className="absolute -z-10 -top-16 -right-16 w-48 h-48 bg-primary/15 blur-[60px] rounded-full pointer-events-none" />
        </div>
    );
}
