import { useState } from 'react'
import {
  ChevronLeft,
  Mail,
  CheckCircle2,
  X,
  Send,
  KeyRound,
  Download,
  AlertTriangle,
} from 'lucide-react'
import { employeeService } from '@services/employeeService'

/* ─── Profile Tabs ────────────────────────────────────────── */
const TABS = [
  'Overview',
  'Employment & contract',
  'Attendance',
  'Schedule',
  'Leave',
  'Pay & payslips',
  'Documents',
  'Performance',
  'Activity',
]

const septGrid = [
  ['on', 'on', 'on', 'on', 'on', 'late', 'on'],
  ['on', 'on', 'on', 'on', 'leave', 'leave', 'leave'],
  ['on', 'on', 'on', 'on', 'on', 'on', 'on'],
  ['on', 'late', 'on', 'on', 'on', 'on', 'on'],
]

function DaySquare({ type }) {
  const cls =
    {
      on: 'bg-[#1c3faa]',
      late: 'bg-[#f59e0b]',
      leave: 'bg-[#818cf8]',
    }[type] || 'bg-[#1c3faa]'
  return <span className={`inline-block h-4 w-7 sm:w-8 rounded-sm ${cls}`} />
}

function LeaveBar({ label, left, total }) {
  const pct = Math.round(((total - left) / total) * 100)
  return (
    <li>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-800">{label}</span>
        <span className="text-slate-400 font-medium">
          {left} of {total} days left
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1eee8]">
        <div
          className="h-full rounded-full bg-[#1c3faa] transition-all"
          style={{ width: `${Math.max(10, 100 - pct)}%` }}
        />
      </div>
    </li>
  )
}

export default function EmployeeProfile({ employee, employeeId, onBack }) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [empData, setEmpData] = useState(() => {
    if (employee) return employee
    return employeeService.getById('NF-0044') || {
      id: employeeId || 'NF-0044',
      name: 'Sarah Namutebi',
      initials: 'SN',
      color: 'bg-green-500',
      status: 'Active',
      position: 'Sales Associate',
      department: 'Sales',
      branch: 'Ntinda Store',
      phone: '0756 907 214',
      email: 'sarah.n@nilefresh.co.ug',
      salary: '1200000',
      started: 'Feb 2023',
      clockedIn: '07:58',
      type: 'Permanent',
      reportsTo: 'David Mugisha',
      shift: 'Day Shift (8:00 AM - 5:00 PM)',
      leaveDays: { annual: 14, annualTotal: 21, sick: 8, sickTotal: 10, emergency: 3, emergencyTotal: 4 },
    }
  })

  // Feedback notifications
  const [feedback, setFeedback] = useState(null)

  // Modals state
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageChannel, setMessageChannel] = useState('SMS')

  const [showResetModal, setShowResetModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [editErrors, setEditErrors] = useState({})

  const showNotification = (msg, type = 'success') => {
    setFeedback({ msg, type })
    setTimeout(() => setFeedback(null), 4000)
  }

  // Handle Send Message
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!messageText.trim()) return
    setShowMessageModal(false)
    setMessageText('')
    showNotification(`Sent ${messageChannel} to ${empData.name} (${messageChannel === 'SMS' ? empData.phone : empData.email})`)
  }

  // Handle Reset Login PIN
  const handleResetLogin = () => {
    setShowResetModal(false)
    showNotification(`Password reset instructions and new temporary PIN sent to ${empData.phone}`)
  }

  // Open Edit Profile
  const handleOpenEdit = () => {
    setEditForm({
      name: empData.name || '',
      phone: empData.phone || '',
      email: empData.email || '',
      position: empData.position || '',
      department: empData.department || 'Sales',
      branch: empData.branch || 'Ntinda Store',
      salary: empData.salary || '1200000',
      status: empData.status || 'Active',
      type: empData.type || 'Permanent',
      reportsTo: empData.reportsTo || 'David Mugisha',
      shift: empData.shift || 'Day Shift (8:00 AM - 5:00 PM)',
    })
    setEditErrors({})
    setShowEditModal(true)
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const errs = {}
    if (!editForm.name.trim()) errs.name = 'Full name is required'
    if (!editForm.phone.trim()) errs.phone = 'Phone number is required'
    if (!editForm.position.trim()) errs.position = 'Position is required'

    if (Object.keys(errs).length > 0) {
      setEditErrors(errs)
      return
    }

    const updated = employeeService.update(empData.id, editForm)
    if (updated) {
      setEmpData(updated)
      setShowEditModal(false)
      showNotification(`Profile updated for ${updated.name}`)
    }
  }

  // Quick Status Toggle
  const handleToggleStatus = (newStatus) => {
    const updated = employeeService.updateStatus(empData.id, newStatus)
    if (updated) {
      setEmpData(updated)
      showNotification(`Status updated to ${newStatus}`)
    }
  }

  // If completely missing employee and not in seed
  if (!employee && employeeId && !employeeService.getById(employeeId)) {
    return (
      <div className="min-w-0 flex-1 bg-[#f8f7f4] p-8">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <AlertTriangle size={32} className="mx-auto text-amber-500 mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Employee Not Found</h2>
          <p className="mt-2 text-xs text-slate-500">
            No employee record exists with the identifier <span className="font-mono font-bold text-slate-800">{employeeId}</span>.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 rounded-xl bg-[#0b1329] px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Return to employee list
          </button>
        </div>
      </div>
    )
  }

  const annualLeft = empData.leaveDays?.annual ?? 14
  const annualTotal = empData.leaveDays?.annualTotal ?? 21
  const sickLeft = empData.leaveDays?.sick ?? 8
  const sickTotal = empData.leaveDays?.sickTotal ?? 10
  const emergencyLeft = empData.leaveDays?.emergency ?? 3
  const emergencyTotal = empData.leaveDays?.emergencyTotal ?? 4

  const grossSalary = Number(empData.salary || 1200000)
  const nssf = Math.round(grossSalary * 0.05)
  const paye = Math.round(grossSalary * 0.15)
  const netPay = grossSalary - nssf - paye

  return (
    <div className="min-w-0 flex-1 bg-[#f8f7f4]">
      {/* Toast */}
      {feedback && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#0b1329] px-4 py-3 text-xs font-semibold text-white shadow-xl border border-slate-700 animate-bounce">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>{feedback.msg}</span>
          <button type="button" onClick={() => setFeedback(null)} className="ml-2 text-slate-400 hover:text-white">
            <X size={13} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 xl:px-8">
        {/* ── Breadcrumb ─────────────────────────────────── */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <ChevronLeft size={14} />
            <span>Employees</span>
          </button>
          <span>/</span>
          <span className="text-slate-700 font-medium">{empData.name}</span>
        </nav>

        {/* ── Profile Header Card ───────────────────────── */}
        <div className="mb-6 rounded-2xl border border-[#ede9e2] bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-wrap items-start gap-4">
              {/* Dark Navy Avatar */}
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#0b1329] text-xl font-extrabold text-white">
                {empData.initials}
              </div>

              {/* Name + metadata */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    {empData.name}
                  </h1>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      empData.status === 'Active'
                        ? 'bg-[#e0f2fe] text-[#0284c7]'
                        : empData.status === 'On leave'
                          ? 'bg-[#ede9fe] text-[#6366f1]'
                          : 'bg-[#fef3c7] text-[#b45309]'
                    }`}
                  >
                    {empData.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {empData.clockedIn && empData.clockedIn !== '—'
                      ? `Clocked in ${empData.clockedIn}`
                      : 'Not clocked in today'}
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-medium">
                  <span>{empData.position}</span>
                  <span>·</span>
                  <span>{empData.department}</span>
                  <span>·</span>
                  <span>{empData.branch}</span>
                  <span>·</span>
                  <span className="font-mono">{empData.id}</span>
                  <span>·</span>
                  <span>{empData.phone}</span>
                  <span>·</span>
                  <span>{empData.email}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setShowMessageModal(true)}
                className="flex items-center gap-1.5 rounded-xl border border-[#e2ddd5] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Mail size={13} className="text-slate-500" />
                <span>Send message</span>
              </button>

              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="flex items-center gap-1.5 rounded-xl border border-[#e2ddd5] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <KeyRound size={13} className="text-slate-500" />
                <span>Reset app login</span>
              </button>

              <button
                type="button"
                onClick={handleOpenEdit}
                className="flex items-center gap-1.5 rounded-xl bg-[#0b1329] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                <span>Edit profile</span>
              </button>
            </div>
          </div>

          {/* Status Quick Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#f0ece5] pt-3 text-xs">
            <span className="text-slate-400 font-medium">Status switch:</span>
            {['Active', 'Probation', 'On leave', 'Exited'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleToggleStatus(st)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  empData.status === st
                    ? 'bg-[#0b1329] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Tabs row */}
          <div className="mt-4 flex gap-6 overflow-x-auto border-t border-[#f0ece5] pt-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={
                  'whitespace-nowrap pb-2 text-xs font-semibold transition border-b-2 ' +
                  (activeTab === tab
                    ? 'border-[#0b1329] text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800')
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content Rendering ─────────────────────────── */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left 2 Cols: Main Info Cards */}
            <div className="space-y-6 lg:col-span-2">
              {/* Performance & Attendance Highlights */}
              <div className="rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 mb-4">September Attendance Preview</h2>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-[#1c3faa]" /> On time (19)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-[#f59e0b]" /> Late (2)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-[#818cf8]" /> Leave (3)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">92% on-time record</span>
                </div>
                <div className="space-y-2">
                  {septGrid.map((row, idx) => (
                    <div key={idx} className="flex gap-2">
                      {row.map((day, dIdx) => (
                        <DaySquare key={dIdx} type={day} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Employment snapshot */}
              <div className="rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 mb-3">Employment Information</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-slate-400 font-medium">Department</dt>
                    <dd className="mt-1 font-bold text-slate-800">{empData.department}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-slate-400 font-medium">Assigned Branch</dt>
                    <dd className="mt-1 font-bold text-slate-800">{empData.branch}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-slate-400 font-medium">Reports To</dt>
                    <dd className="mt-1 font-bold text-slate-800">{empData.reportsTo}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-slate-400 font-medium">Employment Type</dt>
                    <dd className="mt-1 font-bold text-slate-800">{empData.type}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-slate-400 font-medium">Start Date</dt>
                    <dd className="mt-1 font-bold text-slate-800">{empData.started}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-slate-400 font-medium">Shift</dt>
                    <dd className="mt-1 font-bold text-slate-800">{empData.shift}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Right Col: Leave & Pay Balance */}
            <div className="space-y-6">
              {/* Leave Balances Card */}
              <div className="rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-900">Leave Balance (2026)</h2>
                  <span className="text-xs font-semibold text-blue-600">
                    {annualLeft + sickLeft + emergencyLeft} days remaining
                  </span>
                </div>
                <ul className="space-y-4">
                  <LeaveBar label="Annual leave" left={annualLeft} total={annualTotal} />
                  <LeaveBar label="Sick leave" left={sickLeft} total={sickTotal} />
                  <LeaveBar label="Compassionate / Emergency" left={emergencyLeft} total={emergencyTotal} />
                </ul>
              </div>

              {/* Compensation Summary Card */}
              <div className="rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 mb-3">Pay &amp; Compensation</h2>
                <div className="rounded-xl bg-[#0b1329] p-4 text-white">
                  <p className="text-[11px] text-slate-400">Monthly Gross Salary</p>
                  <p className="mt-1 text-2xl font-extrabold">UGX {grossSalary.toLocaleString()}</p>
                  <div className="mt-3 flex justify-between border-t border-slate-700 pt-2 text-[11px] text-slate-300">
                    <span>Est. Net Pay:</span>
                    <span className="font-bold text-emerald-400">UGX {netPay.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">NSSF Deduction (5%):</span>
                    <span className="font-medium">UGX {nssf.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PAYE Tax:</span>
                    <span className="font-medium">UGX {paye.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Frequency:</span>
                    <span className="font-medium">Monthly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Employment & Contract ────────────────────── */}
        {activeTab === 'Employment & contract' && (
          <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">Employment &amp; Contract Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3 border rounded-xl border-slate-200">
                <span className="text-slate-400">Contract Type</span>
                <p className="mt-1 font-bold text-slate-800 text-sm">{empData.type}</p>
              </div>
              <div className="p-3 border rounded-xl border-slate-200">
                <span className="text-slate-400">Start Date</span>
                <p className="mt-1 font-bold text-slate-800 text-sm">{empData.started}</p>
              </div>
              <div className="p-3 border rounded-xl border-slate-200">
                <span className="text-slate-400">Position</span>
                <p className="mt-1 font-bold text-slate-800 text-sm">{empData.position}</p>
              </div>
              <div className="p-3 border rounded-xl border-slate-200">
                <span className="text-slate-400">Department</span>
                <p className="mt-1 font-bold text-slate-800 text-sm">{empData.department}</p>
              </div>
              <div className="p-3 border rounded-xl border-slate-200">
                <span className="text-slate-400">Work Branch</span>
                <p className="mt-1 font-bold text-slate-800 text-sm">{empData.branch}</p>
              </div>
              <div className="p-3 border rounded-xl border-slate-200">
                <span className="text-slate-400">Direct Manager</span>
                <p className="mt-1 font-bold text-slate-800 text-sm">{empData.reportsTo}</p>
              </div>
              <div className="p-3 border rounded-xl border-slate-200">
                <span className="text-slate-400">National ID</span>
                <p className="mt-1 font-bold font-mono text-slate-800 text-sm">{empData.nationalId || 'CM920148123XYZ'}</p>
              </div>
              <div className="p-3 border rounded-xl border-slate-200">
                <span className="text-slate-400">NSSF Number</span>
                <p className="mt-1 font-bold font-mono text-slate-800 text-sm">{empData.nssfNumber || '1009384728'}</p>
              </div>
              <div className="p-3 border rounded-xl border-slate-200">
                <span className="text-slate-400">App Role</span>
                <p className="mt-1 font-bold text-slate-800 text-sm">Staff Employee</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Attendance ───────────────────────────────── */}
        {activeTab === 'Attendance' && (
          <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Attendance Log</h2>
                <p className="text-xs text-slate-500">September 2026 summary for {empData.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                  Present: 21 days
                </span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg">
                  Late: 2 times
                </span>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                  Leave: 3 days
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400">
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Clock In</th>
                    <th className="py-2.5">Clock Out</th>
                    <th className="py-2.5">Method</th>
                    <th className="py-2.5">Branch</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 font-semibold text-slate-800">Mon, 28 Sep</td>
                    <td className="py-3 font-mono">{empData.clockedIn || '07:58'}</td>
                    <td className="py-3 font-mono">17:05</td>
                    <td className="py-3">QR at counter</td>
                    <td className="py-3">{empData.branch}</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">On time</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-800">Fri, 25 Sep</td>
                    <td className="py-3 font-mono">08:14</td>
                    <td className="py-3 font-mono">17:15</td>
                    <td className="py-3">GPS Phone</td>
                    <td className="py-3">{empData.branch}</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">Late (14m)</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-800">Thu, 24 Sep</td>
                    <td className="py-3 font-mono">07:52</td>
                    <td className="py-3 font-mono">17:00</td>
                    <td className="py-3">QR at counter</td>
                    <td className="py-3">{empData.branch}</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">On time</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Schedule ─────────────────────────────────── */}
        {activeTab === 'Schedule' && (
          <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-2">Shift &amp; Working Schedule</h2>
            <p className="text-xs text-slate-500 mb-4">Assigned shift pattern: {empData.shift}</p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <div key={day} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="font-bold text-slate-800">{day}</span>
                  <p className="mt-1 text-slate-500">08:00 – 17:00</p>
                  <span className="mt-2 inline-block rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800">
                    8h shift
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Leave ────────────────────────────────────── */}
        {activeTab === 'Leave' && (
          <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Leave Entitlement &amp; History</h2>
                <p className="text-xs text-slate-500">Track balance and past leave requests</p>
              </div>
              <button
                type="button"
                onClick={() => showNotification(`Leave request modal simulated for ${empData.name}`)}
                className="rounded-xl bg-[#0b1329] px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Request leave for employee
              </button>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <LeaveBar label="Annual leave" left={annualLeft} total={annualTotal} />
              <LeaveBar label="Sick leave" left={sickLeft} total={sickTotal} />
              <LeaveBar label="Emergency leave" left={emergencyLeft} total={emergencyTotal} />
            </ul>
          </div>
        )}

        {/* ── Tab: Pay & Payslips ────────────────────────────── */}
        {activeTab === 'Pay & payslips' && (
          <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900">Payslip Archive</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400">
                    <th className="py-2.5">Period</th>
                    <th className="py-2.5">Gross Pay</th>
                    <th className="py-2.5">NSSF (5%)</th>
                    <th className="py-2.5">PAYE</th>
                    <th className="py-2.5">Net Pay</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {['August 2026', 'July 2026', 'June 2026'].map((period) => (
                    <tr key={period}>
                      <td className="py-3 font-semibold text-slate-800">{period}</td>
                      <td className="py-3">UGX {grossSalary.toLocaleString()}</td>
                      <td className="py-3 text-slate-500">UGX {nssf.toLocaleString()}</td>
                      <td className="py-3 text-slate-500">UGX {paye.toLocaleString()}</td>
                      <td className="py-3 font-bold text-emerald-700">UGX {netPay.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => showNotification(`Downloading payslip for ${period}...`)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Download size={12} />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Documents ────────────────────────────────── */}
        {activeTab === 'Documents' && (
          <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Employee Documents</h2>
                <p className="text-xs text-slate-500">Identity documents, certificates and signed agreements</p>
              </div>
              <button
                type="button"
                onClick={() => showNotification(`Upload modal simulated for ${empData.name}`)}
                className="rounded-xl bg-[#0b1329] px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Upload document
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400">
                    <th className="py-2.5">Document Title</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5">Type</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 font-semibold text-slate-800">Employment Contract 2026</td>
                    <td className="py-3">Contract</td>
                    <td className="py-3 font-mono">PDF</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">Signed</span></td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => showNotification('Downloading contract...')}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-800">National ID Copy</td>
                    <td className="py-3">ID &amp; NSSF</td>
                    <td className="py-3 font-mono">JPG</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">Verified</span></td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => showNotification('Downloading National ID copy...')}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Performance ──────────────────────────────── */}
        {activeTab === 'Performance' && (
          <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Performance Review (Q3 2026)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-slate-400">Attendance Reliability</span>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">96%</p>
                <p className="mt-1 text-[11px] text-emerald-600 font-semibold">+4% from last quarter</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-slate-400">Tasks Completed</span>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">48 / 50</p>
                <p className="mt-1 text-[11px] text-slate-500 font-semibold">96% completion rate</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-slate-400">Supervisor Rating</span>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">4.8 / 5.0</p>
                <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Exceeds expectations</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Activity ─────────────────────────────────── */}
        {activeTab === 'Activity' && (
          <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Recent Employee Activity</h2>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800">Clocked in at Ntinda Store</span>
                <span className="text-slate-400">Today at 07:58 AM</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-semibold text-slate-800">Completed monthly inventory checklist</span>
                <span className="text-slate-400">Yesterday at 04:30 PM</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="font-semibold text-slate-800">Annual leave approved by David Mugisha</span>
                <span className="text-slate-400">18 Sep 2026</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ── Send Message Modal ─────────────────────────────── */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Send Message</h3>
              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 space-y-4 text-xs">
              <div>
                <span className="text-slate-500">Recipient:</span>
                <p className="font-semibold text-slate-800">{empData.name} ({empData.phone})</p>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="channel"
                    value="SMS"
                    checked={messageChannel === 'SMS'}
                    onChange={() => setMessageChannel('SMS')}
                  />
                  <span>SMS to Phone</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="channel"
                    value="Email"
                    checked={messageChannel === 'Email'}
                    onChange={() => setMessageChannel('Email')}
                  />
                  <span>Email</span>
                </label>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message content</label>
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-slate-800"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#0b1329] px-4 py-2 font-semibold text-white hover:bg-slate-800"
                >
                  <Send size={13} />
                  <span>Send {messageChannel}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reset Login Modal ──────────────────────────────── */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-slate-900">Reset App Login</h3>
            <p className="mt-2 text-slate-600">
              Are you sure you want to reset the login PIN for <span className="font-semibold text-slate-800">{empData.name}</span>?
            </p>
            <p className="mt-1 text-slate-500">
              A temporary PIN code will be sent via SMS to <span className="font-bold text-slate-800">{empData.phone}</span>.
            </p>
            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetLogin}
                className="rounded-xl bg-[#0b1329] px-4 py-2 font-semibold text-white hover:bg-slate-800"
              >
                Confirm reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Profile Modal ─────────────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl my-8 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>
                <p className="text-slate-500 font-mono">{empData.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                    required
                  />
                  {editErrors.name && <p className="text-rose-600 mt-1">{editErrors.name}</p>}
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                    required
                  />
                  {editErrors.phone && <p className="text-rose-600 mt-1">{editErrors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Position *</label>
                  <input
                    type="text"
                    value={editForm.position}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white"
                  >
                    {['Sales', 'Operations', 'Finance', 'Human resources', 'Warehouse', 'Logistics'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch</label>
                  <select
                    value={editForm.branch}
                    onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white"
                  >
                    {['Ntinda Store', 'Kampala HQ', 'Mukono Warehouse', 'Entebbe Depot', 'Wakiso route'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white font-semibold"
                  >
                    {['Active', 'Probation', 'On leave', 'Exited'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Salary (UGX)</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.salary}
                    onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shift</label>
                  <select
                    value={editForm.shift}
                    onChange={(e) => setEditForm({ ...editForm, shift: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white"
                  >
                    <option value="Day Shift (8:00 AM - 5:00 PM)">Day Shift (8:00 AM - 5:00 PM)</option>
                    <option value="Evening Shift (1:00 PM - 10:00 PM)">Evening Shift (1:00 PM - 10:00 PM)</option>
                    <option value="Night Shift (10:00 PM - 7:00 AM)">Night Shift (10:00 PM - 7:00 AM)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0b1329] px-5 py-2 font-semibold text-white hover:bg-slate-800"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
