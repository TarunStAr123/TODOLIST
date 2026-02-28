import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, Eye, EyeOff, AlertCircle } from 'lucide-react';

type Mode = 'signin' | 'signup';
interface FormState { name: string; email: string; password: string; }
interface FormErrors { name?: string; email?: string; password?: string; }

export default function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [mode, setMode] = useState<Mode>(() =>
        searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
    );
    const [form, setForm] = useState<FormState>({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 30);
        return () => clearTimeout(t);
    }, []);

    if (user) return <Navigate to="/dashboard" replace />;

    const validate = (): FormErrors => {
        const e: FormErrors = {};
        if (mode === 'signup' && !form.name.trim()) e.name = 'Name is required.';
        if (!form.email.trim()) { e.email = 'Email is required.'; }
        else if (!/\S+@\S+\.\S+/.test(form.email)) { e.email = 'Please enter a valid email.'; }
        if (!form.password) { e.password = 'Password is required.'; }
        else if (form.password.length < 6) { e.password = 'Password must be at least 6 characters.'; }
        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setIsSubmitting(true);
        await new Promise<void>((res) => setTimeout(res, 700));
        const displayName = mode === 'signup' ? form.name : (form.email.split('@')[0] ?? 'User');
        login(displayName, form.email);
        navigate('/dashboard', { replace: true });
    };

    const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
    };

    const switchMode = () => {
        setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
        setErrors({});
        setForm({ name: '', email: '', password: '' });
    };

    const inputClasses = (hasError: boolean) =>
        `w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium outline-none transition-all duration-200 focus:scale-[1.01] focus:shadow-lg focus:shadow-primary/10 ${hasError
            ? 'border-red-400 dark:border-red-500 focus:border-red-500'
            : 'border-slate-200 dark:border-slate-600 focus:border-primary focus:ring-4 focus:ring-primary/10'
        }`;

    return (
        <div className="min-h-screen flex font-sans bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* LEFT BRANDING PANEL */}
            <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-14 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 relative z-10 group hover:opacity-90 transition-opacity duration-200">
                    <div className="bg-primary p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-105">
                        <Layers size={22} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-xl text-white tracking-tight">TaskFlow</span>
                </Link>

                {/* Hero copy */}
                <div className="relative z-10">
                    <blockquote className="text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                        Your tasks,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">beautifully</span>{' '}
                        organized.
                    </blockquote>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Join 10,000+ teams who use TaskFlow to stay focused, hit deadlines, and do their best work.
                    </p>
                    <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <p className="text-slate-300 text-sm italic leading-relaxed mb-4">
                            "TaskFlow transformed how our team manages projects. It's the one tool we actually open every morning."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-bold text-sm">R</div>
                            <div>
                                <p className="text-white text-sm font-semibold">Riya Sharma</p>
                                <p className="text-slate-500 text-xs">Head of Product, Finloop</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-slate-600 text-xs relative z-10">© 2026 TaskFlow Inc.</p>
            </div>

            {/* RIGHT FORM PANEL */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-slate-50 dark:bg-slate-900">
                <div className={`w-full max-w-md transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    {/* Mobile logo */}
                    <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden group hover:opacity-80 transition-opacity duration-200">
                        <div className="bg-primary p-2 rounded-xl transition-transform duration-200 group-hover:scale-105">
                            <Layers size={20} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">TaskFlow</span>
                    </Link>

                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
                        {mode === 'signin' ? 'Welcome back' : 'Create your account'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-9">
                        {mode === 'signin' ? 'Enter your credentials to access your workspace.' : 'Start your free trial — no credit card required.'}
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {mode === 'signup' && (
                            <div className="animate-task-in">
                                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                                <input id="name" type="text" value={form.name} onChange={handleChange('name')} placeholder="Tarun Mamillapalli" className={inputClasses(!!errors.name)} />
                                {errors.name && <ErrorMsg msg={errors.name} />}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                            <input id="email" type="email" value={form.email} onChange={handleChange('email')} placeholder="you@example.com" className={inputClasses(!!errors.email)} />
                            {errors.email && <ErrorMsg msg={errors.email} />}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                            <div className="relative">
                                <input id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange('password')}
                                    placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'} className={inputClasses(!!errors.password)} />
                                <button type="button" onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors p-1 rounded"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <ErrorMsg msg={errors.password} />}
                        </div>

                        <button type="submit" disabled={isSubmitting}
                            className="w-full py-3.5 mt-2 bg-primary hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Please wait…
                                </>
                            ) : mode === 'signin' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
                        {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button onClick={switchMode} className="font-semibold text-primary hover:underline transition-colors">
                            {mode === 'signin' ? 'Sign up free' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

function ErrorMsg({ msg }: { msg: string }) {
    return (
        <p className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-red-500 animate-task-in">
            <AlertCircle size={13} />
            {msg}
        </p>
    );
}
