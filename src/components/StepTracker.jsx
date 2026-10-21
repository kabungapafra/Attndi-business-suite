import { Check } from 'lucide-react';

const steps = [
  { id: 1, name: 'Personal details', sub: 'Name, contacts, ID' },
  { id: 2, name: 'Job & placement', sub: 'Branch, role, clock-in' },
  { id: 3, name: 'Contract & pay', sub: 'Salary, allowances, bank' },
  { id: 4, name: 'Schedule', sub: 'Shift pattern' },
  { id: 5, name: 'Documents', sub: 'Contract, ID, certificates' },
  { id: 6, name: 'Review & invite', sub: 'Send app invite' },
];

export default function StepTracker({ currentStep, setCurrentStep }) {
  return (
    <nav aria-label="Employee setup steps" className="space-y-1">
      {/* Mobile: horizontal scrollable stepper */}
      <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
        {steps.map(({ id, name }) => {
          const active = currentStep === id;
          const complete = currentStep > id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setCurrentStep(id)}
              aria-current={active ? 'step' : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ${
                active
                  ? 'bg-[#0b1329] text-white'
                  : complete
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200'
              }`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${
                  complete
                    ? 'bg-blue-600 text-white'
                    : active
                      ? 'bg-[#f4af45] text-slate-950'
                      : 'bg-slate-200 text-slate-600'
                }`}
              >
                {complete ? <Check size={12} /> : id}
              </span>
              <span className="whitespace-nowrap">{name}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop: vertical stepper */}
      <div className="hidden space-y-1 lg:block">
        {steps.map(({ id, name, sub }) => {
          const active = currentStep === id;
          const complete = currentStep > id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setCurrentStep(id)}
              aria-current={active ? 'step' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition ${
                active ? 'bg-[#0b1329] text-white shadow-sm' : 'hover:bg-slate-200/70'
              }`}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                  complete
                    ? 'bg-blue-600 text-white'
                    : active
                      ? 'bg-[#f4af45] text-slate-950'
                      : 'bg-slate-200 text-slate-600'
                }`}
              >
                {complete ? <Check size={14} /> : id}
              </span>
              <span>
                <span
                  className={`block text-xs font-semibold ${
                    active ? 'text-white' : complete ? 'text-blue-900' : 'text-slate-700'
                  }`}
                >
                  {name}
                </span>
                <span className={`mt-0.5 block text-[11px] ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                  {sub}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
