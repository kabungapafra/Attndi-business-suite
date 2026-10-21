import { useState, useMemo } from 'react'
import {
  Search,
  ChevronDown,
  Upload,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Check,
  X,
  Filter,
} from 'lucide-react'
import { employeeService } from '@services/employeeService'

function StatusBadge({ status, onClick }) {
  let badgeClass = 'bg-slate-100 text-slate-700'
  if (status === 'Active') {
    badgeClass = 'bg-[#e0f2fe] text-[#0284c7]'
  } else if (status === 'On leave') {
    badgeClass = 'bg-[#ede9fe] text-[#6366f1]'
  } else if (status === 'Probation') {
    badgeClass = 'bg-[#fef3c7] text-[#b45309]'
  } else if (status === 'Exited') {
    badgeClass = 'bg-rose-50 text-rose-700'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title="Click to toggle or change status"
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition hover:opacity-80 ${badgeClass}`}
    >
      {status}
    </button>
  )
}

const PAGE_SIZE = 8

export default function EmployeesList({ onAddEmployee, onSelectEmployee }) {
  const [dataVersion, setDataVersion] = useState(0)
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('All')
  const [selectedDept, setSelectedDept] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [checked, setChecked] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [feedback, setFeedback] = useState(null)

  // Edit Employee Modal state
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [editErrors, setEditErrors] = useState({})

  // Status Change Dialog state
  const [statusDialogEmp, setStatusDialogEmp] = useState(null)

  const { allEmployees, countsByStatus } = useMemo(() => {
    // dataVersion dependency triggers refetch
    void dataVersion
    const res = employeeService.getAll()
    return {
      allEmployees: res.employees,
      countsByStatus: res.countsByStatus,
    }
  }, [dataVersion])

  // Extract unique branches and departments for dropdown filters
  const branches = useMemo(() => {
    const list = Array.from(new Set(allEmployees.map((e) => e.branch).filter(Boolean)))
    return ['All', ...list]
  }, [allEmployees])

  const departments = useMemo(() => {
    const list = Array.from(new Set(allEmployees.map((e) => e.department).filter(Boolean)))
    return ['All', ...list]
  }, [allEmployees])

  const employmentTypes = useMemo(() => {
    const list = Array.from(new Set(allEmployees.map((e) => e.type).filter(Boolean)))
    return ['All', ...list]
  }, [allEmployees])

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return allEmployees.filter((emp) => {
      if (activeTab !== 'All' && emp.status !== activeTab) return false
      if (selectedBranch !== 'All' && emp.branch !== selectedBranch) return false
      if (selectedDept !== 'All' && emp.department !== selectedDept) return false
      if (selectedType !== 'All' && emp.type !== selectedType) return false

      if (q) {
        const matchesName = emp.name?.toLowerCase().includes(q)
        const matchesId = emp.id?.toLowerCase().includes(q)
        const matchesPhone = emp.phone?.includes(q)
        const matchesEmail = emp.email?.toLowerCase().includes(q)
        const matchesPos = emp.position?.toLowerCase().includes(q)
        const matchesDept = emp.department?.toLowerCase().includes(q)
        const matchesBranch = emp.branch?.toLowerCase().includes(q)
        if (!matchesName && !matchesId && !matchesPhone && !matchesEmail && !matchesPos && !matchesDept && !matchesBranch) {
          return false
        }
      }
      return true
    })
  }, [allEmployees, activeTab, selectedBranch, selectedDept, selectedType, searchQuery])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE))
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredEmployees.slice(start, start + PAGE_SIZE)
  }, [filteredEmployees, currentPage])

  // Reset page when filter changes
  const handleFilterChange = (setter, value) => {
    setter(value)
    setCurrentPage(1)
  }

  const showNotification = (msg, type = 'success') => {
    setFeedback({ msg, type })
    setTimeout(() => setFeedback(null), 4000)
  }

  // Row selection
  const toggleSelect = (id) => {
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (checked.length === paginatedEmployees.length && paginatedEmployees.length > 0) {
      setChecked([])
    } else {
      setChecked(paginatedEmployees.map((e) => e.id))
    }
  }

  // Bulk status update
  const handleBulkStatusChange = (newStatus) => {
    checked.forEach((id) => {
      employeeService.updateStatus(id, newStatus)
    })
    setDataVersion((v) => v + 1)
    setChecked([])
    showNotification(`Updated ${checked.length} employees to ${newStatus}`)
  }

  // Export handler
  const handleExport = () => {
    const target = checked.length > 0
      ? allEmployees.filter((e) => checked.includes(e.id))
      : filteredEmployees
    employeeService.exportToCsv(target)
    showNotification(`Exported ${target.length} employee records to CSV`)
  }

  // Import from CSV handler
  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
      if (lines.length <= 1) {
        showNotification('The selected CSV file has no employee data rows', 'error')
        return
      }

      let importedCount = 0
      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.replace(/^"|"$/g, '').trim())
        if (parts[1]) {
          employeeService.create({
            fullName: parts[1],
            phone: parts[2] || '',
            email: parts[3] || '',
            jobPosition: parts[4] || 'Staff',
            department: parts[5] || 'Sales',
            branch: parts[6] || 'Kampala HQ',
            employmentType: parts[7] || 'Permanent',
          })
          importedCount++
        }
      }

      setDataVersion((v) => v + 1)
      showNotification(`Successfully imported ${importedCount} employees from file!`)
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  // Open Edit Modal
  const openEditModal = (emp, e) => {
    e.stopPropagation()
    setEditingEmployee(emp)
    setEditFormData({
      name: emp.name || '',
      phone: emp.phone || '',
      email: emp.email || '',
      position: emp.position || '',
      department: emp.department || 'Sales',
      branch: emp.branch || 'Ntinda Store',
      type: emp.type || 'Permanent',
      status: emp.status || 'Active',
      salary: emp.salary || '1000000',
    })
    setEditErrors({})
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!editFormData.name.trim()) errs.name = 'Full name is required'
    if (!editFormData.phone.trim()) errs.phone = 'Phone number is required'
    if (!editFormData.position.trim()) errs.position = 'Job position is required'

    if (Object.keys(errs).length > 0) {
      setEditErrors(errs)
      return
    }

    const updated = employeeService.update(editingEmployee.id, editFormData)
    if (updated) {
      setDataVersion((v) => v + 1)
      setEditingEmployee(null)
      showNotification(`Saved changes for ${updated.name}`)
    }
  }

  // Quick Status change from dialog
  const handleQuickStatusChange = (newStatus) => {
    if (!statusDialogEmp) return
    employeeService.updateStatus(statusDialogEmp.id, newStatus)
    setDataVersion((v) => v + 1)
    setStatusDialogEmp(null)
    showNotification(`Status updated to "${newStatus}" for ${statusDialogEmp.name}`)
  }

  const statusTabs = [
    { label: 'All', count: countsByStatus.All },
    { label: 'Active', count: countsByStatus.Active },
    { label: 'Probation', count: countsByStatus.Probation },
    { label: 'On leave', count: countsByStatus['On leave'] },
    { label: 'Exited', count: countsByStatus.Exited },
  ]

  const startIndex = (currentPage - 1) * PAGE_SIZE + 1
  const endIndex = Math.min(currentPage * PAGE_SIZE, filteredEmployees.length)

  return (
    <div className="min-w-0 flex-1 bg-[#f8f7f4]">
      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 xl:px-8">
        {/* ── Feedback Toast ──────────────────────────────────── */}
        {feedback && (
          <div
            className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold shadow-lg transition-all animate-bounce ${
              feedback.type === 'error'
                ? 'bg-rose-900 text-white'
                : 'bg-[#0b1329] text-white border border-slate-700'
            }`}
          >
            <span>{feedback.msg}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── Page Header ──────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <nav className="mb-1 text-xs text-slate-500 font-medium">
              People · <span className="text-slate-700">Employees</span>
            </nav>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {allEmployees.length} people work here
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Hidden file input for Excel/CSV import */}
            <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#e2ddd5] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
              <Upload size={14} className="text-slate-500" />
              <span>Import from Excel</span>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleImportFile}
                className="sr-only"
              />
            </label>

            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-xl border border-[#e2ddd5] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Download size={14} className="text-slate-500" />
              <span>Export {checked.length > 0 ? `(${checked.length})` : 'All'}</span>
            </button>

            <button
              type="button"
              onClick={onAddEmployee}
              className="flex items-center gap-1.5 rounded-xl bg-[#0b1329] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus size={14} />
              <span>Add employee</span>
            </button>
          </div>
        </div>

        {/* ── Search + Filter Controls Row ─────────────────── */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative min-w-[220px] max-w-xs flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                placeholder="Name, ID, phone or position..."
                className="w-full rounded-xl border border-[#e2ddd5] bg-white py-2 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleFilterChange(setSearchQuery, '')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Branch Filter Dropdown */}
            <div className="relative">
              <label className="flex items-center gap-1.5 rounded-xl border border-[#e2ddd5] bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50">
                <span className="text-slate-400">Branch:</span>
                <select
                  value={selectedBranch}
                  onChange={(e) => handleFilterChange(setSelectedBranch, e.target.value)}
                  className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer pr-1"
                >
                  {branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="text-slate-400 pointer-events-none" />
              </label>
            </div>

            {/* Department Filter Dropdown */}
            <div className="relative">
              <label className="flex items-center gap-1.5 rounded-xl border border-[#e2ddd5] bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50">
                <span className="text-slate-400">Department:</span>
                <select
                  value={selectedDept}
                  onChange={(e) => handleFilterChange(setSelectedDept, e.target.value)}
                  className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer pr-1"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="text-slate-400 pointer-events-none" />
              </label>
            </div>

            {/* Employment Type Filter Dropdown */}
            <div className="relative">
              <label className="flex items-center gap-1.5 rounded-xl border border-[#e2ddd5] bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50">
                <span className="text-slate-400">Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => handleFilterChange(setSelectedType, e.target.value)}
                  className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer pr-1"
                >
                  {employmentTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="text-slate-400 pointer-events-none" />
              </label>
            </div>

            {/* Clear filters if any filter applied */}
            {(searchQuery || selectedBranch !== 'All' || selectedDept !== 'All' || selectedType !== 'All' || activeTab !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedBranch('All')
                  setSelectedDept('All')
                  setSelectedType('All')
                  setActiveTab('All')
                  setCurrentPage(1)
                }}
                className="text-xs font-semibold text-blue-600 hover:underline px-2"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Status Pill Tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-[#e2ddd5] bg-[#f2eee7] p-1">
            {statusTabs.map((tab) => {
              const isSelected = activeTab === tab.label
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => handleFilterChange(setActiveTab, tab.label)}
                  className={
                    'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ' +
                    (isSelected
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900')
                  }
                >
                  <span>{tab.label}</span>
                  <span className={isSelected ? 'text-slate-800 font-bold' : 'text-slate-500 font-medium'}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Bulk Actions Bar (Appears when checkboxes are ticked) ── */}
        {checked.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-white text-[11px] font-bold">
                {checked.length}
              </span>
              <span className="text-xs font-semibold text-blue-900">
                {checked.length} employee{checked.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-blue-800">Change status:</span>
              <button
                type="button"
                onClick={() => handleBulkStatusChange('Active')}
                className="rounded-lg bg-white border border-blue-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-100/50"
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange('Probation')}
                className="rounded-lg bg-white border border-blue-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-100/50"
              >
                Probation
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange('On leave')}
                className="rounded-lg bg-white border border-blue-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-100/50"
              >
                On leave
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="rounded-lg bg-[#0b1329] px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800 ml-2"
              >
                Export selected
              </button>
              <button
                type="button"
                onClick={() => setChecked([])}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 ml-1"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* ── Table Container ──────────────────────────────── */}
        <div className="rounded-2xl border border-[#ede9e2] bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-xs">
              <thead>
                <tr className="border-b border-[#f0ece5] text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-[#fbfaf8]">
                  <th className="w-10 py-3.5 pl-5 pr-2 text-left">
                    <input
                      type="checkbox"
                      checked={
                        checked.length === paginatedEmployees.length &&
                        paginatedEmployees.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3.5 text-left">EMPLOYEE</th>
                  <th className="px-4 py-3.5 text-left">ID</th>
                  <th className="px-4 py-3.5 text-left">POSITION</th>
                  <th className="px-4 py-3.5 text-left">DEPARTMENT</th>
                  <th className="px-4 py-3.5 text-left">BRANCH</th>
                  <th className="px-4 py-3.5 text-left">TYPE</th>
                  <th className="px-4 py-3.5 text-left">STARTED</th>
                  <th className="px-4 py-3.5 text-left">STATUS</th>
                  <th className="px-5 py-3.5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f2eb]">
                {paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Filter size={24} className="text-slate-300 mb-2" />
                        <p className="font-semibold text-slate-700">No employees found</p>
                        <p className="mt-1 text-xs text-slate-400">
                          Try adjusting your search query or filter options.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="cursor-pointer transition hover:bg-slate-50/80"
                      onClick={() => onSelectEmployee(emp)}
                    >
                      <td className="py-3.5 pl-5 pr-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={checked.includes(emp.id)}
                          onChange={() => toggleSelect(emp.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white ${
                              emp.color || 'bg-blue-600'
                            }`}
                          >
                            {emp.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{emp.name}</p>
                            <p className="text-[11px] text-slate-400">{emp.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-600">
                        {emp.id}
                      </td>
                      <td className="px-4 py-3.5 text-slate-800 font-medium">{emp.position}</td>
                      <td className="px-4 py-3.5 text-slate-600">{emp.department}</td>
                      <td className="px-4 py-3.5 text-slate-600">{emp.branch}</td>
                      <td className="px-4 py-3.5 text-slate-600">{emp.type}</td>
                      <td className="px-4 py-3.5 text-slate-500 font-medium">{emp.started}</td>
                      <td
                        className="px-4 py-3.5"
                        onClick={(e) => {
                          e.stopPropagation()
                          setStatusDialogEmp(emp)
                        }}
                      >
                        <StatusBadge status={emp.status} />
                      </td>
                      <td
                        className="px-5 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => openEditModal(emp, e)}
                            title="Edit employee"
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                          >
                            <Pencil size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Working Pagination ─────────────────────── */}
          <div className="flex flex-wrap items-center justify-between border-t border-[#f0ece5] px-5 py-4 gap-3 bg-[#fbfaf8]/50">
            <span className="text-xs text-slate-500 font-medium">
              {filteredEmployees.length > 0
                ? `Showing ${startIndex}–${endIndex} of ${filteredEmployees.length} employees`
                : '0 employees'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="grid h-8 w-8 place-items-center rounded-lg border border-[#e2ddd5] bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                title="Previous page"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCurrentPage(n)}
                  className={
                    'grid h-8 w-8 place-items-center rounded-lg text-xs font-semibold transition ' +
                    (currentPage === n
                      ? 'bg-[#0b1329] text-white shadow-sm'
                      : 'border border-[#e2ddd5] bg-white text-slate-700 hover:bg-slate-50')
                  }
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="grid h-8 w-8 place-items-center rounded-lg border border-[#e2ddd5] bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                title="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Status Change Modal ──────────────────────── */}
      {statusDialogEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Update Employee Status
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Select new employment status for <span className="font-semibold text-slate-800">{statusDialogEmp.name}</span> ({statusDialogEmp.id}):
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {['Active', 'Probation', 'On leave', 'Exited'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleQuickStatusChange(st)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition ${
                    statusDialogEmp.status === st
                      ? 'border-[#0b1329] bg-[#0b1329] text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {statusDialogEmp.status === st && <Check size={12} />}
                  <span>{st}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setStatusDialogEmp(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Employee Modal ─────────────────────────────── */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Edit Employee Profile
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {editingEmployee.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingEmployee(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs outline-none ${
                      editErrors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'
                    }`}
                  />
                  {editErrors.name && (
                    <p className="mt-1 text-[11px] text-rose-600">{editErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs outline-none ${
                      editErrors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'
                    }`}
                  />
                  {editErrors.phone && (
                    <p className="mt-1 text-[11px] text-rose-600">{editErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Job Position *
                  </label>
                  <input
                    type="text"
                    value={editFormData.position}
                    onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs outline-none ${
                      editErrors.position ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'
                    }`}
                  />
                  {editErrors.position && (
                    <p className="mt-1 text-[11px] text-rose-600">{editErrors.position}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none bg-white"
                  >
                    {['Sales', 'Operations', 'Finance', 'Human resources', 'Warehouse', 'Logistics'].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch
                  </label>
                  <select
                    value={editFormData.branch}
                    onChange={(e) => setEditFormData({ ...editFormData, branch: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none bg-white"
                  >
                    {['Ntinda Store', 'Kampala HQ', 'Mukono Warehouse', 'Entebbe Depot', 'Wakiso route'].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none bg-white font-semibold"
                  >
                    {['Active', 'Probation', 'On leave', 'Exited'].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Salary (UGX)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.salary}
                    onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none bg-white"
                  >
                    {['Permanent', 'Contract', 'Casual'].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0b1329] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
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
