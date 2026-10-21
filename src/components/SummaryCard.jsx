import { BriefcaseBusiness, MapPin } from 'lucide-react';

export default function SummaryCard({ formData }) {
  const initials =
    formData.fullName
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'EN';

  return (
    <div className="flex h-full flex-col gap-4">
      <section className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">New employee</p>
        <div className="mt-4 flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[0.95rem] font-bold text-slate-900">
              {formData.fullName || 'Employee name'}
            </h3>
            <p className="mt-0.5 truncate text-xs text-slate-500">{formData.phone || 'No phone number'}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs">
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">ID</span>
            <span className="font-semibold text-slate-700">{formData.employeeId || 'Assigned on save'}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Email</span>
            <span className="max-w-[65%] truncate text-right font-semibold text-slate-700" title={formData.email}>
              {formData.email || 'Not provided'}
            </span>
          </div>
        </div>
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <p className="flex items-center gap-2">
            <BriefcaseBusiness size={14} />
            {formData.jobPosition || 'Job position'}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={14} />
            {formData.branch || 'Branch'}
          </p>
        </div>
      </section>

      <section className="flex-1 rounded-[18px] bg-[#0b1329] p-4 text-white shadow-sm">
        <h3 className="text-xs font-bold">What happens when you finish</h3>
        <ul className="mt-3 list-inside list-disc space-y-2 text-xs leading-relaxed text-slate-300">
          <li>
            {formData.fullName.split(' ')[0] || 'The employee'} gets an SMS with a link to the Attndi app
          </li>
          <li>They register their face and phone on their first day</li>
          <li>They are added to the selected branch and payroll</li>
        </ul>
      </section>
    </div>
  );
}
