import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Layers,
    Inbox,
    CalendarDays,
    FolderKanban,
    LogOut,
    ChevronRight,
    Hash,
} from 'lucide-react';

interface User {
    name: string;
    email: string;
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    count?: number;
    active?: boolean;
}

function NavItem({ icon, label, count, active = false }: NavItemProps) {
    return (
        <button
            className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${active
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
        >
            <span className="flex items-center gap-3">
                <span className={`transition-colors ${active ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {icon}
                </span>
                {label}
            </span>
            {count !== undefined && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${active ? 'bg-primary/20 text-primary' : 'text-slate-400'}`}>
                    {count}
                </span>
            )}
        </button>
    );
}

const PROJECTS = [
    { color: 'bg-orange-400', label: 'Marketing' },
    { color: 'bg-blue-500', label: 'Redesign' },
    { color: 'bg-green-500', label: 'Launch' },
];

export default function Sidebar({ user }: { user: User }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        await new Promise((r) => setTimeout(r, 400));
        logout();
        navigate('/', { replace: true });
    };

    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <aside className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col shadow-sm shrink-0">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-slate-100">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="bg-primary p-2 rounded-xl transition-transform group-hover:scale-105 duration-150">
                        <Layers size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-lg text-slate-900 tracking-tight">TaskFlow</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
                <NavItem icon={<Inbox size={18} />} label="Inbox" count={4} />
                <NavItem icon={<CalendarDays size={18} />} label="Today" active count={3} />
                <NavItem icon={<FolderKanban size={18} />} label="Projects" />

                <div className="pt-6 pb-2">
                    <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        My Projects
                    </p>
                    {PROJECTS.map((p) => (
                        <button
                            key={p.label}
                            className="group w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-150"
                        >
                            <span className="flex items-center gap-3">
                                <Hash size={14} className={`text-slate-400 group-hover:text-slate-600`} />
                                {p.label}
                            </span>
                            <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </button>
                    ))}
                </div>
            </nav>

            {/* User section */}
            <div className="px-3 py-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
                >
                    <LogOut
                        size={17}
                        className="transition-transform group-hover:-translate-x-0.5 duration-150"
                    />
                    {loggingOut ? 'Signing out…' : 'Sign Out'}
                </button>
            </div>
        </aside>
    );
}
