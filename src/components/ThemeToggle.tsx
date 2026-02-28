import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
    className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
            className={`w-10 h-10 flex items-center justify-center rounded-xl
        text-slate-500 dark:text-slate-400
        hover:bg-slate-100 dark:hover:bg-slate-700
        hover:text-primary dark:hover:text-primary
        transition-all duration-200 active:scale-90
        ${className}`}
        >
            {isDark ? (
                <Sun size={20} strokeWidth={2} />
            ) : (
                <Moon size={20} strokeWidth={2} />
            )}
        </button>
    );
}
