import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MiniCalendarProps {
    selectedDate: string;          // YYYY-MM-DD
    onDateSelect: (date: string) => void;
    taskDates: Set<string>;        // dates that have ≥1 task
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

function toYMD(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function MiniCalendar({ selectedDate, onDateSelect, taskDates }: MiniCalendarProps) {
    const today = new Date();
    const todayYMD = toYMD(today.getFullYear(), today.getMonth(), today.getDate());

    // Initialise the viewed month from selectedDate
    const initViewed = () => {
        const [y, m] = selectedDate.split('-').map(Number);
        return { year: y, month: m - 1 };
    };
    const [viewed, setViewed] = useState(initViewed);

    const prevMonth = () =>
        setViewed(({ year, month }) =>
            month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
        );

    const nextMonth = () =>
        setViewed(({ year, month }) =>
            month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
        );

    // Calendar grid: pad with empty cells from previous month
    const firstDay = new Date(viewed.year, viewed.month, 1).getDay();
    const daysInMonth = new Date(viewed.year, viewed.month + 1, 0).getDate();

    const cells: (number | null)[] = [
        ...Array<null>(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 w-full select-none">
            {/* Month header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={prevMonth}
                    aria-label="Previous month"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary transition-all duration-150 active:scale-90"
                >
                    <ChevronLeft size={16} strokeWidth={2.5} />
                </button>

                <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                    {MONTHS[viewed.month]} {viewed.year}
                </h2>

                <button
                    onClick={nextMonth}
                    aria-label="Next month"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary transition-all duration-150 active:scale-90"
                >
                    <ChevronRight size={16} strokeWidth={2.5} />
                </button>
            </div>

            {/* Day-of-week labels */}
            <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                    <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Date cells */}
            <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((day, idx) => {
                    if (day === null) return <div key={`e-${idx}`} />;

                    const ymd = toYMD(viewed.year, viewed.month, day);
                    const isToday = ymd === todayYMD;
                    const isSelected = ymd === selectedDate;
                    const hasTask = taskDates.has(ymd);

                    return (
                        <button
                            key={ymd}
                            onClick={() => onDateSelect(ymd)}
                            aria-label={`Select ${ymd}`}
                            aria-pressed={isSelected}
                            className={`
                relative flex flex-col items-center justify-center h-9 w-full rounded-xl text-sm font-medium
                transition-all duration-150 active:scale-90
                ${isSelected
                                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                                    : isToday
                                        ? 'bg-primary/10 text-primary font-bold'
                                        : 'text-slate-700 hover:bg-slate-100 hover:text-primary'
                                }
              `}
                        >
                            {day}
                            {/* Task dot indicator */}
                            {hasTask && !isSelected && (
                                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isToday ? 'bg-primary' : 'bg-slate-400'}`} />
                            )}
                            {hasTask && isSelected && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/70" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* "Today" shortcut */}
            {selectedDate !== todayYMD && (
                <button
                    onClick={() => {
                        onDateSelect(todayYMD);
                        setViewed({ year: today.getFullYear(), month: today.getMonth() });
                    }}
                    className="mt-3 w-full text-center text-xs font-semibold text-primary hover:underline transition-colors"
                >
                    Jump to Today
                </button>
            )}
        </div>
    );
}
