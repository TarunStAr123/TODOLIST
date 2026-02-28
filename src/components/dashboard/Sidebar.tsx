import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';
import CircularProgress from './CircularProgress';
import SignOutModal from '../ui/SignOutModal';
import { Layers, Inbox, CalendarCheck2, LogOut } from 'lucide-react';

interface User { name: string; email: string; }
interface NavItemProps { icon: React.ReactNode; label: string; count?: number; active?: boolean; }

function NavItem({ icon, label, count, active = false }: NavItemProps) {
    return (
        <button
            className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 ${active
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
            aria-current={active ? 'page' : undefined}
        >
            <span className="flex items-center gap-3">
                <span className={`transition-colors ${active ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} aria-hidden="true">
                    {icon}
                </span>
                {label}
            </span>
            {count !== undefined && count > 0 && (
                <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${active ? 'bg-primary/20 text-primary' : 'text-slate-400 dark:text-slate-500'}`}
                    aria-label={`${count} pending`}
                >
                    {count}
                </span>
            )}
        </button>
    );
}

interface SidebarProps {
    user: User;
    scheduledCount: number;
    selectedDate: string;
    totalTasks: number;
    completedTasks: number;
    streak: number;
}

export default function Sidebar({ user, scheduledCount, selectedDate, totalTasks, completedTasks, streak }: SidebarProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleConfirmSignOut = async () => {
        setShowModal(false);
        await new Promise((r) => setTimeout(r, 100));
        logout();
        navigate('/', { replace: true });
    };

    const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

    const today = new Date();
    const todayYMD = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const isToday = selectedDate === todayYMD;

    const [y, m, d] = selectedDate.split('-').map(Number);
    const scheduleLabel = isToday
        ? 'Schedule — Today'
        : `Schedule — ${new Date(y, m - 1, d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;

    return (
        <>
            <aside
                className="w-64 h-screen bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 flex flex-col shadow-sm dark:shadow-slate-900/50 shrink-0 transition-colors duration-300"
                role="complementary"
                aria-label="Sidebar navigation"
            >
                {/* Logo */}
                <div className="px-5 py-5 border-b border-slate-100 dark:border-slate-700">
                    <Link
                        to="/"
                        className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-lg"
                        aria-label="TaskFlow home"
                    >
                        <div className="bg-primary p-2 rounded-xl transition-transform group-hover:scale-105 duration-150" aria-hidden="true">
                            <Layers size={20} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">TaskFlow</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="px-3 pt-5 space-y-1" aria-label="Main navigation">
                    <NavItem icon={<Inbox size={18} />} label="Inbox" />
                    <NavItem
                        icon={<CalendarCheck2 size={18} />}
                        label={scheduleLabel}
                        active
                        count={scheduledCount}
                    />
                </nav>

                {/* Daily Progress */}
                <div className="px-3 pt-3 pb-1">
                    <p
                        className="px-1 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                        aria-hidden="true"
                    >
                        Daily Progress
                    </p>
                    <div
                        className="flex flex-col items-center gap-3 px-3 py-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 transition-colors duration-300"
                        role="region"
                        aria-label="Daily task progress"
                    >
                        <CircularProgress totalTasks={totalTasks} completedTasks={completedTasks} />
                    </div>
                </div>

                {/* Streak */}
                {streak >= 2 && (
                    <p
                        className="px-4 mt-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 text-center"
                        aria-label={`${streak} day streak`}
                    >
                        🔥 {streak}-day streak
                    </p>
                )}

                {/* Spacer */}
                <div className="flex-1" aria-hidden="true" />

                {/* Theme + User + Sign Out */}
                <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between px-3 py-1">
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Appearance</span>
                        <ThemeToggle />
                    </div>

                    <div
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-100 dark:border-slate-700"
                        aria-label={`Signed in as ${user.name}`}
                    >
                        <div
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white text-xs font-bold shrink-0"
                            aria-hidden="true"
                        >
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        aria-label="Sign out of TaskFlow"
                        className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400/30"
                    >
                        <LogOut size={17} className="transition-transform group-hover:-translate-x-0.5 duration-150" aria-hidden="true" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Sign-out confirmation modal */}
            {showModal && (
                <SignOutModal
                    onConfirm={handleConfirmSignOut}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </>
    );
}
