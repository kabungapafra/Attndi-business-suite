import { useState } from 'react';
import {
  BarChart3,
  Bell,
  Building2,
  Calendar,
  CheckSquare,
  ChevronDown,
  Clock,
  DollarSign,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  Users,
  X,
} from 'lucide-react';
import Logo from './Logo.jsx';

const sections = [
  {
    title: 'Overview',
    items: [{ label: 'Overview', view: 'overview', icon: LayoutDashboard }],
  },
  {
    title: 'People',
    items: [
      { label: 'Employees', view: 'employees', icon: Users },
      { label: 'Branches & departments', view: 'branches', icon: Building2 },
      { label: 'Documents & contracts', view: 'documents', icon: FileText },
    ],
  },
  {
    title: 'Time',
    items: [
      { label: 'Attendance', view: 'attendance', icon: Clock },
      { label: 'Schedules & shifts', view: 'schedules', icon: Calendar },
      { label: 'Leave', view: 'leave', icon: Calendar, badge: '3' },
    ],
  },
  {
    title: 'Work',
    items: [
      { label: 'Tasks', view: 'tasks', icon: CheckSquare },
      { label: 'Performance', view: 'performance', icon: BarChart3 },
    ],
  },
  {
    title: 'Money',
    items: [
      { label: 'Payroll', view: 'payroll', icon: DollarSign },
      { label: 'Expenses', view: 'expenses', icon: DollarSign, badge: '2' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'Notifications', view: 'notifications', icon: Bell },
      { label: 'Reports', view: 'reports', icon: BarChart3 },
      { label: 'Audit trail', view: 'audit', icon: Shield },
      { label: 'Settings', view: 'settings', icon: Settings },
    ],
  },
];

export default function Sidebar({ activeView, onSelectView }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-[#0b1329] px-4 py-3 md:hidden">
        <div className="flex items-center gap-2.5">
          <Logo className="h-7 w-7" />
          <span className="text-lg font-bold text-white">Attndi</span>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 hover:bg-[#16203a]"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-[272px] max-w-[85vw] flex-col bg-[#0b1329] text-slate-300 transition-transform duration-200 md:sticky md:top-0 md:z-30 md:h-screen md:max-h-screen md:w-64 md:max-w-none md:shrink-0 md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        <div className="hidden items-center gap-3 px-5 py-5 md:flex">
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight text-white">Attndi</span>
        </div>

        <div className="mx-3 mb-3 mt-4 flex items-center gap-3 rounded-xl border border-slate-700/70 bg-[#141e38] p-3 md:mt-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange-100 text-xs font-bold text-orange-950">
            NF
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">Nile Fresh Supplies</p>
            <p className="truncate text-[11px] text-slate-400">All branches · 138 staff</p>
          </div>
          <ChevronDown size={14} className="shrink-0 text-slate-500" aria-hidden="true" />
        </div>

        <nav
          aria-label="Primary navigation"
          className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-2 text-xs font-medium"
        >
          {sections.map((section) => (
            <section key={section.title}>
              {section.title !== 'Overview' && (
                <h2 className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {section.title}
                </h2>
              )}
              {section.items.map(({ label, view, icon: Icon, badge }) => {
                const active = activeView === view;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      onSelectView(view);
                      setMobileOpen(false);
                    }}
                    className={`mb-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                      active
                        ? 'bg-[#1c2848] font-semibold text-white'
                        : 'text-slate-300 hover:bg-[#16203a] hover:text-white'
                    }`}
                  >
                    <Icon size={16} aria-hidden="true" className="shrink-0" />
                    <span className="flex-1 truncate">{label}</span>
                    {badge && (
                      <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </section>
          ))}
        </nav>

        <div className="flex items-center justify-between border-t border-slate-800/80 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-600 bg-slate-700 text-xs font-bold text-white">
              PK
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">Pafra K.</p>
              <p className="truncate text-[11px] text-slate-400">Owner · Admin</p>
            </div>
          </div>
          <button type="button" title="Log out" className="shrink-0 rounded p-2 text-slate-400 hover:text-white">
            <LogOut size={15} />
          </button>
        </div>
      </aside>
    </>
  );
}
