interface CircularProgressProps {
    totalTasks: number;
    completedTasks: number;
}

const RADIUS = 36;
const STROKE_WIDTH = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SIZE = (RADIUS + STROKE_WIDTH / 2 + 2) * 2; // tight viewBox

export default function CircularProgress({ totalTasks, completedTasks }: CircularProgressProps) {
    const hasNoTasks = totalTasks === 0;
    const percentage = hasNoTasks ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;
    const complete = !hasNoTasks && completedTasks === totalTasks;

    const arcColor = complete ? '#22c55e' : 'var(--color-primary, #ef4444)';
    const ariaLabel = hasNoTasks
        ? 'No tasks scheduled for this day'
        : `${percentage} percent of tasks completed for selected date`;

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Ring */}
            <div className="relative">
                <svg
                    width={SIZE}
                    height={SIZE}
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    role="img"
                    aria-label={ariaLabel}
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    {/* Background track */}
                    <circle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={RADIUS}
                        fill="none"
                        strokeWidth={STROKE_WIDTH}
                        className="stroke-slate-200 dark:stroke-slate-600"
                    />
                    {/* Progress arc */}
                    <circle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={RADIUS}
                        fill="none"
                        strokeWidth={STROKE_WIDTH}
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={offset}
                        stroke={arcColor}
                        style={{ transition: 'stroke-dashoffset 400ms ease-in-out, stroke 300ms ease' }}
                    />
                </svg>

                {/* Centre percentage */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    aria-hidden="true"
                >
                    {hasNoTasks ? (
                        <span className="text-sm font-bold text-slate-300 dark:text-slate-600">0%</span>
                    ) : (
                        <span
                            className="text-base font-extrabold leading-none"
                            style={{ color: complete ? '#22c55e' : 'var(--color-primary, #ef4444)' }}
                        >
                            {percentage}%
                        </span>
                    )}
                </div>
            </div>

            {/* Text below ring */}
            {hasNoTasks ? (
                <p className="text-xs text-center text-slate-400 dark:text-slate-500 font-medium leading-snug">
                    No tasks scheduled
                </p>
            ) : (
                <div className="text-center space-y-0.5">
                    <p className={`text-sm font-bold leading-none ${complete ? 'text-green-500' : 'text-slate-800 dark:text-slate-100'}`}>
                        {complete ? 'All done!' : `${percentage}% Complete`}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'} &bull; {completedTasks} Done
                    </p>
                </div>
            )}
        </div>
    );
}
