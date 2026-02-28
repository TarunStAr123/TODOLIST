import React from 'react';
import { Inbox, Calendar, Folder, CheckCircle2, Circle, MoreHorizontal } from 'lucide-react';

export default function DashboardMock() {
    return (
        <div className="relative w-full max-w-[600px] h-[450px] bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden flex transform transition-transform hover:-translate-y-2 duration-500">

            {/* Sidebar */}
            <div className="w-[180px] bg-slate-50 border-r border-slate-100 p-4 hidden md:flex flex-col h-full">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>
                    <span className="font-semibold text-sm">Workspace</span>
                </div>

                <div className="space-y-1">
                    <NavItem icon={<Inbox size={16} />} label="Inbox" active />
                    <NavItem icon={<Calendar size={16} />} label="Today" count={3} />
                    <NavItem icon={<Folder size={16} />} label="Projects" />
                </div>

                <div className="mt-8 px-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Projects
                </div>
                <div className="space-y-1">
                    <ProjectItem color="bg-orange-400" label="Marketing" />
                    <ProjectItem color="bg-blue-500" label="Redesign" />
                    <ProjectItem color="bg-green-500" label="Product Launch" />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 flex flex-col h-full bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Today</h2>
                    <MoreHorizontal className="text-slate-400 cursor-pointer" size={20} />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">

                    <TaskItem
                        title="Review Q3 marketing strategy"
                        tag="Marketing"
                        tagColor="text-orange-600 bg-orange-100"
                        done={false}
                    />

                    <TaskItem
                        title="Finalize new landing page copy"
                        tag="Content"
                        tagColor="text-purple-600 bg-purple-100"
                        done={false}
                    />

                    <TaskItem
                        title="Sync with design team"
                        tag="Meeting"
                        tagColor="text-blue-600 bg-blue-100"
                        done={true}
                    />

                    <TaskItem
                        title="Update user onboarding flow"
                        tag="Product"
                        tagColor="text-green-600 bg-green-100"
                        done={false}
                    />

                    <button className="flex items-center gap-2 text-primary font-medium text-sm mt-4 hover:opacity-80 transition py-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-lg leading-none pb-[2px]">+</span>
                        Add Task
                    </button>
                </div>
            </div>

            {/* Decorative gradient blur behind */}
            <div className="absolute -z-10 -top-20 -right-20 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
        </div>
    );
}

function NavItem({ icon, label, count, active = false }: { icon: React.ReactNode, label: string, count?: number, active?: boolean }) {
    return (
        <div className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer text-sm transition-colors ${active ? 'bg-white text-primary font-medium shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3">
                <span className={active ? 'text-primary' : 'text-slate-400'}>{icon}</span>
                <span>{label}</span>
            </div>
            {count && <span className="text-xs font-semibold text-slate-400">{count}</span>}
        </div>
    )
}

function ProjectItem({ color, label }: { color: string, label: string }) {
    return (
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer text-sm text-slate-600 hover:bg-slate-100 transition-colors">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span>{label}</span>
        </div>
    )
}

function TaskItem({ title, tag, tagColor, done }: { title: string, tag: string, tagColor: string, done: boolean }) {
    return (
        <div className={`group flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:shadow-md transition-all cursor-pointer ${done ? 'bg-slate-50 bg-opacity-50' : 'bg-white'}`}>
            <button className={`mt-0.5 flex-shrink-0 ${done ? 'text-green-500' : 'text-slate-300 group-hover:text-primary'}`}>
                {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </button>
            <div className="flex-1">
                <p className={`text-sm ${done ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>{title}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${done ? 'bg-slate-200 text-slate-500' : tagColor}`}>
                    {tag}
                </span>
            </div>
        </div>
    )
}
