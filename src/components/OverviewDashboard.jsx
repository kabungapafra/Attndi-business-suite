import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  X,
} from 'lucide-react'

/* ─── Static clock-in data ─────────────────────────────────────────── */
const initialClockIns = [
  { time: '08:26', initials: 'RN', color: 'bg-blue-500', name: 'Ruth Nabirye', role: 'Human resources', branch: 'Kampala HQ', method: 'Office device', status: 'late', lateMins: 26 },
  { time: '08:21', initials: 'IK', color: 'bg-purple-500', name: 'Ivan Kizza', role: 'Field sales', branch: 'Wakiso route', method: 'GPS', status: 'late', lateMins: 21 },
  { time: '08:14', initials: 'EA', color: 'bg-teal-500', name: 'Esther Akello', role: 'Finance', branch: 'Kampala HQ', method: 'Office device', status: 'late', lateMins: 14 },
  { time: '08:02', initials: 'DM', color: 'bg-orange-500', name: 'David Mugisha', role: 'Warehouse', branch: 'Mukono Warehouse', method: 'QR code', status: 'ontime' },
  { time: '07:58', initials: 'SN', color: 'bg-green-500', name: 'Sarah Namutebi', role: 'Sales', branch: 'Ntinda Store', method: 'QR code', status: 'ontime' },
  { time: '07:51', initials: 'JO', color: 'bg-red-500', name: 'Joseph Okello', role: 'Drivers', branch: 'Entebbe Depot', method: 'GPS', status: 'ontime' },
  { time: '07:44', initials: 'GA', color: 'bg-indigo-500', name: 'Grace Atim', role: 'Warehouse', branch: 'Mukono Warehouse', method: 'QR code', status: 'ontime' },
]

const initialApprovals = [
  { id: 'app-1', name: 'Annet Nakato', detail: 'Annual leave · 5-9 Oct · 5 days' },
  { id: 'app-2', name: 'Brian Ssemwogerere', detail: 'Expense claim · Fuel · UGX 180,000' },
  { id: 'app-3', name: 'Grace Atim', detail: 'Salary advance · UGX 400,000' },
  { id: 'app-4', name: 'Joseph Okello', detail: 'Shift swap · Sat 3 Oct with P. Lubega' },
]

const branchesData = [
  { name: 'Kampala HQ', onTime: 58, total: 64, pct: 91 },
  { name: 'Ntinda Store', onTime: 22, total: 26, pct: 85 },
  { name: 'Mukono Warehouse', onTime: 24, total: 33, pct: 58 },
  { name: 'Entebbe Depot', onTime: 8, total: 15, pct: 35 },
]

function Badge({ status, mins }) {
  if (status === 'ontime') {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
        On time
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
      Late {mins}m
    </span>
  )
}

export default function OverviewDashboard({ onNavigateToEmployees }) {
  const navigate = useNavigate()
  const [branch, setBranch] = useState('All branches')
  const [approvals, setApprovals] = useState(initialApprovals)
  const [feedback, setFeedback] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const showNotification = (msg) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3500)
  }

  const handleApprovalAction = (id, personName, action) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id))
    showNotification(`${action === 'approved' ? 'Approved' : 'Declined'} request for ${personName}`)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/employees?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-w-0 flex-1 bg-[#f8f7f4]">
      {/* Toast */}
      {feedback && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#0b1329] px-4 py-3 text-xs font-semibold text-white shadow-xl border border-slate-700 animate-bounce">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)} className="ml-2 text-slate-400 hover:text-white">
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-[#ede9e2] bg-[#f8f7f4]/90 backdrop-blur-md px-4 py-3 sm:px-6 xl:px-8">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-medium">Monday, 28 September 2026</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Good morning, Pafra
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <form onSubmit={handleSearchSubmit} className="relative min-w-[200px] sm:min-w-[240px] lg:min-w-[280px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people, tasks, payslips..."
              className="w-full rounded-xl border border-[#e2ddd5] bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 shadow-sm"
            />
          </form>

          {/* Branch selector */}
          <button
            type="button"
            onClick={() => {
              const next = branch === 'All branches' ? 'Kampala HQ' : branch === 'Kampala HQ' ? 'Ntinda Store' : 'All branches'
              setBranch(next)
              showNotification(`Filtered overview to ${next}`)
            }}
            className="flex items-center gap-2 rounded-xl border border-[#e2ddd5] bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            <span>{branch}</span>
            <ChevronDown size={13} className="text-slate-500" />
          </button>

          {/* Notification bell */}
          <button
            type="button"
            onClick={() => showNotification('Notifications panel: 3 new alerts received today')}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2ddd5] bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f97316] ring-2 ring-white" />
          </button>

          {/* Review payroll button */}
          <button
            type="button"
            onClick={() => navigate('/payroll')}
            className="flex items-center gap-2 rounded-xl bg-[#0b1329] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <span>Review payroll</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 xl:px-8">
        {/* ── Stat Cards Row ─────────────────────────────────── */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Present now */}
          <div
            onClick={() => navigate('/attendance')}
            className="flex flex-col justify-between rounded-2xl bg-[#0b1329] p-5 shadow-sm text-white min-h-[140px] cursor-pointer transition hover:bg-slate-900"
          >
            <div>
              <p className="text-xs font-medium text-slate-400">Present now</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight sm:text-5xl">112</span>
                <span className="text-xs text-slate-400 font-medium">of 138 scheduled</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">81% on-time record</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                View board <ArrowRight size={12} />
              </span>
            </div>
          </div>

          {/* Card 2: Late today */}
          <div
            onClick={() => navigate('/attendance')}
            className="flex flex-col justify-between rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm min-h-[140px] cursor-pointer transition hover:bg-slate-50"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500">Late today</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">9</span>
                <span className="text-xs font-medium text-amber-600">avg 18 mins</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Mukono Warehouse has 5</span>
              <span className="font-semibold text-blue-600">Details →</span>
            </div>
          </div>

          {/* Card 3: Missing documents */}
          <div
            onClick={() => navigate('/documents')}
            className="flex flex-col justify-between rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm min-h-[140px] cursor-pointer transition hover:bg-slate-50"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500">Missing documents</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">5</span>
                <span className="text-xs font-medium text-rose-600">urgent action</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>3 contracts end soon</span>
              <span className="font-semibold text-blue-600">Resolve →</span>
            </div>
          </div>

          {/* Card 4: Staff on leave */}
          <div
            onClick={() => navigate('/leave')}
            className="flex flex-col justify-between rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm min-h-[140px] cursor-pointer transition hover:bg-slate-50"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500">Staff on leave</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">7</span>
                <span className="text-xs font-medium text-indigo-600">planned</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>6 pending approval</span>
              <span className="font-semibold text-blue-600">Review →</span>
            </div>
          </div>
        </div>

        {/* ── Main Content Grid ──────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Live Clock-ins Table */}
          <div className="rounded-2xl border border-[#ede9e2] bg-white shadow-sm overflow-hidden lg:col-span-2">
            <div className="flex items-center justify-between border-b border-[#f0ece5] px-5 py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Live clock-ins</h2>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <button
                type="button"
                onClick={() => navigate('/attendance')}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
              >
                <span>Open attendance board</span>
                <ExternalLink size={12} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-xs">
                <thead>
                  <tr className="border-b border-[#f0ece5] text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-[#fbfaf8]">
                    <th className="py-3 pl-5 pr-3 text-left">TIME</th>
                    <th className="px-3 py-3 text-left">EMPLOYEE</th>
                    <th className="px-3 py-3 text-left">BRANCH</th>
                    <th className="px-3 py-3 text-left">METHOD</th>
                    <th className="px-3 py-3 pr-5 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f2eb]">
                  {initialClockIns.map((row) => (
                    <tr
                      key={`${row.time}-${row.name}`}
                      onClick={() => onNavigateToEmployees && onNavigateToEmployees(row.name)}
                      className="cursor-pointer transition hover:bg-slate-50"
                    >
                      <td className="py-3 pl-5 pr-3 font-mono font-semibold text-slate-500">{row.time}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white ${row.color}`}>
                            {row.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 hover:text-blue-600">{row.name}</p>
                            <p className="text-[11px] text-slate-400">{row.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-600">{row.branch}</td>
                      <td className="px-3 py-3 text-slate-600">{row.method}</td>
                      <td className="px-3 py-3 pr-5 text-right">
                        <Badge status={row.status} mins={row.lateMins} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-[#f0ece5] p-3 text-center bg-[#fbfaf8]/60">
              <button
                type="button"
                onClick={() => navigate('/employees')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View all employee records →
              </button>
            </div>
          </div>

          {/* Right Column: Approvals + Attendance by Branch */}
          <div className="space-y-6">
            {/* Needs your approval */}
            <div className="rounded-2xl border border-[#ede9e2] bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#f0ece5] px-5 py-4">
                <h2 className="text-base font-bold text-slate-900">Needs your approval</h2>
                <button
                  type="button"
                  onClick={() => navigate('/leave')}
                  className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  {approvals.length} pending · view all
                </button>
              </div>

              {approvals.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
                  <p className="font-semibold text-slate-700">All caught up!</p>
                  <p className="mt-1 text-slate-400">No pending approvals at this time.</p>
                </div>
              ) : (
                <ul className="divide-y divide-[#f5f2eb]">
                  {approvals.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800">{item.name}</p>
                        <p className="text-[11px] text-slate-400">{item.detail}</p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApprovalAction(item.id, item.name, 'declined')}
                          className="rounded-lg border border-[#e2ddd5] bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprovalAction(item.id, item.name, 'approved')}
                          className="rounded-lg bg-[#0b1329] px-3.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
                        >
                          Approve
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Attendance by branch */}
            <div className="rounded-2xl border border-[#ede9e2] bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#f0ece5] px-5 py-4">
                <h2 className="text-base font-bold text-slate-900">Attendance by branch</h2>
                <button
                  type="button"
                  onClick={() => navigate('/branches')}
                  className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Branches →
                </button>
              </div>

              <ul className="space-y-4 px-5 py-4">
                {branchesData.map((b) => {
                  const latePct = b.pct < 100 ? Math.min(25, 100 - b.pct) : 0
                  return (
                    <li key={b.name}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{b.name}</span>
                        <span className="text-slate-400 font-medium">{b.onTime} / {b.total}</span>
                      </div>
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#f1eee8]">
                        <div
                          className="h-full rounded-l-full bg-[#1c3faa] transition-all"
                          style={{ width: `${b.pct}%` }}
                        />
                        {latePct > 0 && (
                          <div
                            className="h-full bg-[#f59e0b] transition-all"
                            style={{ width: `${latePct}%` }}
                          />
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="flex items-center gap-5 border-t border-[#f0ece5] px-5 py-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#1c3faa]" />
                  On time
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#f59e0b]" />
                  Late
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
