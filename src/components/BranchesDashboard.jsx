import { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

const STORAGE_KEY_BRANCHES = 'attndi_branches_data'
const STORAGE_KEY_DEPTS = 'attndi_depts_data'
const STORAGE_KEY_POS = 'attndi_positions_data'

const DEFAULT_BRANCHES = [
  {
    id: 'br-1',
    name: 'Kampala HQ',
    address: 'Plot 12, Yusuf Lule Rd',
    staff: 64,
    manager: 'Ruth Nabirye',
    clockIn: 'Device + GPS 100 m',
    hours: '08:00–17:00 Mon–Fri',
    radius: '100m',
  },
  {
    id: 'br-2',
    name: 'Ntinda Store',
    address: 'Ntinda Shopping Centre',
    staff: 26,
    manager: 'David Mugisha',
    clockIn: 'QR at counter',
    hours: '08:00–21:00 daily',
    radius: '50m',
  },
  {
    id: 'br-3',
    name: 'Mukono Warehouse',
    address: 'Jinja Rd, Mukono',
    staff: 33,
    manager: 'Grace Atim',
    clockIn: 'QR + Face check',
    hours: '07:00–18:00 Mon–Sat',
    radius: '150m',
  },
  {
    id: 'br-4',
    name: 'Entebbe Depot',
    address: 'Airport Rd, Entebbe',
    staff: 15,
    manager: 'John Bukenya',
    clockIn: 'GPS 150 m',
    hours: '08:00–17:00 Mon–Fri',
    radius: '150m',
  },
]

const DEFAULT_DEPARTMENTS = [
  { id: 'dp-1', name: 'Sales', head: 'Esther Akello', staff: 41, branchCount: 3 },
  { id: 'dp-2', name: 'Warehouse', head: 'Grace Atim', staff: 30, branchCount: 1 },
  { id: 'dp-3', name: 'Logistics', head: 'Martin Kato', staff: 22, branchCount: 2 },
  { id: 'dp-4', name: 'Finance', head: 'Moses Waiswa', staff: 19, branchCount: 2 },
  { id: 'dp-5', name: 'Operations', head: 'Sarah Namatovu', staff: 18, branchCount: 4 },
  { id: 'dp-6', name: 'Human resources', head: 'Pafra K.', staff: 8, branchCount: 4 },
]

const DEFAULT_POSITIONS = [
  { id: 'pos-1', title: 'Sales Associate', department: 'Sales', grade: 'G2', payRange: '700K – 1.1M', filled: '24 / 26', hiring: true },
  { id: 'pos-2', title: 'Loader', department: 'Warehouse', grade: 'G1', payRange: '450K – 650K', filled: '12 / 14', hiring: true },
  { id: 'pos-3', title: 'Shift Supervisor', department: 'Operations', grade: 'G3', payRange: '1.2M – 1.6M', filled: '7 / 9', hiring: true },
  { id: 'pos-4', title: 'Accounts Officer', department: 'Finance', grade: 'G3', payRange: '1.3M – 1.8M', filled: '5 / 7', hiring: true },
  { id: 'pos-5', title: 'Store Manager', department: 'Sales', grade: 'G4', payRange: '2.0M – 2.8M', filled: '4 / 4', hiring: false },
  { id: 'pos-6', title: 'Driver', department: 'Logistics', grade: 'G2', payRange: '800K – 1.0M', filled: '8 / 8', hiring: false },
]

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback
  } catch {
    return fallback
  }
}

export default function BranchesDashboard() {
  const [branches, setBranches] = useState(() => getStored(STORAGE_KEY_BRANCHES, DEFAULT_BRANCHES))
  const [departments, setDepartments] = useState(() => getStored(STORAGE_KEY_DEPTS, DEFAULT_DEPARTMENTS))
  const [positions, setPositions] = useState(() => getStored(STORAGE_KEY_POS, DEFAULT_POSITIONS))

  const [searchQuery, setSearchQuery] = useState('')
  const [feedback, setFeedback] = useState(null)

  // Modals state
  const [activeModal, setActiveModal] = useState(null) // 'addBranch', 'editBranch', 'addDept', 'editDept', 'addPos', 'editPos', 'viewBranch'
  const [modalData, setModalData] = useState({})
  const [modalErrors, setModalErrors] = useState({})

  // Delete Confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null) // { type: 'branch'|'dept'|'pos', id, name }

  const showNotification = (msg, type = 'success') => {
    setFeedback({ msg, type })
    setTimeout(() => setFeedback(null), 4000)
  }

  const saveBranchesToStorage = (updated) => {
    setBranches(updated)
    localStorage.setItem(STORAGE_KEY_BRANCHES, JSON.stringify(updated))
  }

  const saveDeptsToStorage = (updated) => {
    setDepartments(updated)
    localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(updated))
  }

  const savePosToStorage = (updated) => {
    setPositions(updated)
    localStorage.setItem(STORAGE_KEY_POS, JSON.stringify(updated))
  }

  // Filtered lists
  const q = searchQuery.trim().toLowerCase()
  const filteredBranches = useMemo(() => {
    if (!q) return branches
    return branches.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.manager.toLowerCase().includes(q)
    )
  }, [branches, q])

  const filteredDepartments = useMemo(() => {
    if (!q) return departments
    return departments.filter(
      (d) => d.name.toLowerCase().includes(q) || d.head.toLowerCase().includes(q)
    )
  }, [departments, q])

  const filteredPositions = useMemo(() => {
    if (!q) return positions
    return positions.filter(
      (p) => p.title.toLowerCase().includes(q) || p.department.toLowerCase().includes(q)
    )
  }, [positions, q])

  // Branch CRUD
  const handleOpenAddBranch = () => {
    setModalData({
      name: '',
      address: '',
      staff: 0,
      manager: 'David Mugisha',
      clockIn: 'QR + GPS 100 m',
      hours: '08:00–17:00 Mon–Fri',
      radius: '100m',
    })
    setModalErrors({})
    setActiveModal('addBranch')
  }

  const handleOpenEditBranch = (branch) => {
    setModalData({ ...branch })
    setModalErrors({})
    setActiveModal('editBranch')
  }

  const handleSaveBranch = (e) => {
    e.preventDefault()
    const errs = {}
    if (!modalData.name?.trim()) errs.name = 'Branch name is required'
    if (!modalData.address?.trim()) errs.address = 'Branch address is required'
    if (!modalData.manager?.trim()) errs.manager = 'Branch manager is required'

    if (Object.keys(errs).length > 0) {
      setModalErrors(errs)
      return
    }

    if (activeModal === 'addBranch') {
      const newBranch = {
        ...modalData,
        id: `br-${Date.now()}`,
        staff: Number(modalData.staff) || 0,
      }
      saveBranchesToStorage([...branches, newBranch])
      showNotification(`Added branch "${newBranch.name}"`)
    } else {
      const updated = branches.map((b) => (b.id === modalData.id ? { ...modalData } : b))
      saveBranchesToStorage(updated)
      showNotification(`Updated branch "${modalData.name}"`)
    }
    setActiveModal(null)
  }

  // Department CRUD
  const handleOpenAddDept = () => {
    setModalData({
      name: '',
      head: '',
      staff: 0,
      branchCount: 1,
    })
    setModalErrors({})
    setActiveModal('addDept')
  }

  const handleOpenEditDept = (dept) => {
    setModalData({ ...dept })
    setModalErrors({})
    setActiveModal('editDept')
  }

  const handleSaveDept = (e) => {
    e.preventDefault()
    const errs = {}
    if (!modalData.name?.trim()) errs.name = 'Department name is required'
    if (!modalData.head?.trim()) errs.head = 'Department head is required'

    if (Object.keys(errs).length > 0) {
      setModalErrors(errs)
      return
    }

    if (activeModal === 'addDept') {
      const newDept = {
        ...modalData,
        id: `dp-${Date.now()}`,
        staff: Number(modalData.staff) || 0,
        branchCount: Number(modalData.branchCount) || 1,
      }
      saveDeptsToStorage([...departments, newDept])
      showNotification(`Added department "${newDept.name}"`)
    } else {
      const updated = departments.map((d) => (d.id === modalData.id ? { ...modalData } : d))
      saveDeptsToStorage(updated)
      showNotification(`Updated department "${modalData.name}"`)
    }
    setActiveModal(null)
  }

  // Position CRUD
  const handleOpenAddPos = () => {
    setModalData({
      title: '',
      department: 'Sales',
      grade: 'G2',
      payRange: '800K – 1.2M',
      filled: '0 / 2',
      hiring: true,
    })
    setModalErrors({})
    setActiveModal('addPos')
  }

  const handleOpenEditPos = (pos) => {
    setModalData({ ...pos })
    setModalErrors({})
    setActiveModal('editPos')
  }

  const handleSavePos = (e) => {
    e.preventDefault()
    const errs = {}
    if (!modalData.title?.trim()) errs.title = 'Position title is required'
    if (!modalData.department?.trim()) errs.department = 'Department is required'

    if (Object.keys(errs).length > 0) {
      setModalErrors(errs)
      return
    }

    if (activeModal === 'addPos') {
      const newPos = {
        ...modalData,
        id: `pos-${Date.now()}`,
      }
      savePosToStorage([...positions, newPos])
      showNotification(`Added position "${newPos.title}"`)
    } else {
      const updated = positions.map((p) => (p.id === modalData.id ? { ...modalData } : p))
      savePosToStorage(updated)
      showNotification(`Updated position "${modalData.title}"`)
    }
    setActiveModal(null)
  }

  // Delete Action
  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    if (deleteTarget.type === 'branch') {
      saveBranchesToStorage(branches.filter((b) => b.id !== deleteTarget.id))
      showNotification(`Deleted branch "${deleteTarget.name}"`)
    } else if (deleteTarget.type === 'dept') {
      saveDeptsToStorage(departments.filter((d) => d.id !== deleteTarget.id))
      showNotification(`Deleted department "${deleteTarget.name}"`)
    } else if (deleteTarget.type === 'pos') {
      savePosToStorage(positions.filter((p) => p.id !== deleteTarget.id))
      showNotification(`Deleted position "${deleteTarget.name}"`)
    }
    setDeleteTarget(null)
  }

  return (
    <div className="min-w-0 flex-1 bg-[#f5f6f8]">
      {/* Toast Notification */}
      {feedback && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#0b1329] px-4 py-3 text-xs font-semibold text-white shadow-xl border border-slate-700 animate-bounce">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>{feedback.msg}</span>
          <button type="button" onClick={() => setFeedback(null)} className="ml-2 text-slate-400 hover:text-white">
            <X size={13} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 xl:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">People · Structure</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Branches, departments &amp; positions
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Manage physical locations, organizational units, and job tiers across Nile Fresh.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleOpenAddDept}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Plus size={13} />
              <span>Add department</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAddPos}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Plus size={13} />
              <span>Add position</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAddBranch}
              className="flex items-center gap-1.5 rounded-xl bg-[#0b1329] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus size={13} />
              <span>Add branch</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex max-w-md items-center">
          <div className="relative w-full">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search branch, location, manager, department..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ── Branch Cards Section ───────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Active Branches ({filteredBranches.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {filteredBranches.map((branch) => (
              <article
                key={branch.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-slate-900">{branch.name}</h3>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{branch.address}</p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-blue-50 px-2 py-0.5 font-mono text-sm font-bold text-blue-900">
                      {branch.staff} staff
                    </span>
                  </div>

                  <dl className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-400 font-medium">Manager</dt>
                      <dd className="font-semibold text-slate-800">{branch.manager}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-400 font-medium">Clock-in Rule</dt>
                      <dd className="font-semibold text-slate-800">{branch.clockIn}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-400 font-medium">Hours</dt>
                      <dd className="font-semibold text-slate-800">{branch.hours}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => handleOpenEditBranch(branch)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Edit geofence &amp; rules
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditBranch(branch)}
                      title="Edit branch"
                      className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ type: 'branch', id: branch.id, name: branch.name })}
                      title="Delete branch"
                      className="rounded-lg p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── Departments + Job Positions Split Section ─────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Departments Table */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Departments</h2>
                <p className="text-xs text-slate-500">Core organizational divisions</p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddDept}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                + Add
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400">
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Head of Dept</th>
                    <th className="pb-3">Staff</th>
                    <th className="pb-3">Branches</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDepartments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-slate-50/70">
                      <td className="py-3 font-semibold text-slate-900">{dept.name}</td>
                      <td className="py-3 text-slate-600">{dept.head}</td>
                      <td className="py-3 font-bold text-slate-700">{dept.staff}</td>
                      <td className="py-3 text-slate-500">{dept.branchCount} locations</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditDept(dept)}
                            title="Edit department"
                            className="p-1 text-slate-400 hover:text-slate-700"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ type: 'dept', id: dept.id, name: dept.name })}
                            title="Delete department"
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Job Positions Table */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Job Positions</h2>
                <p className="text-xs text-slate-500">Pay bands &amp; headcount capacity</p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddPos}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                + Add
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400">
                    <th className="pb-3">Position</th>
                    <th className="pb-3">Dept</th>
                    <th className="pb-3">Grade</th>
                    <th className="pb-3">Pay Range (UGX)</th>
                    <th className="pb-3">Filled</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPositions.map((pos) => (
                    <tr key={pos.id} className="hover:bg-slate-50/70">
                      <td className="py-3 font-semibold text-slate-900 whitespace-nowrap">{pos.title}</td>
                      <td className="py-3 text-slate-600">{pos.department}</td>
                      <td className="py-3 font-mono text-slate-500">{pos.grade}</td>
                      <td className="py-3 text-slate-600 font-medium">{pos.payRange}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 ${pos.hiring ? 'text-amber-700 font-bold' : 'text-slate-600'}`}>
                          {pos.filled}
                          {pos.hiring && <span className="rounded bg-amber-50 px-1 py-0.5 text-[9px] font-bold uppercase">Hiring</span>}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditPos(pos)}
                            title="Edit position"
                            className="p-1 text-slate-400 hover:text-slate-700"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ type: 'pos', id: pos.id, name: pos.title })}
                            title="Delete position"
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* ── Add / Edit Branch Modal ────────────────────────── */}
      {(activeModal === 'addBranch' || activeModal === 'editBranch') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {activeModal === 'addBranch' ? 'Add New Branch' : 'Edit Branch & Geofence'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branch Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Jinja Highway Depot"
                  value={modalData.name || ''}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-800"
                  required
                />
                {modalErrors.name && <p className="mt-1 text-rose-600">{modalErrors.name}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physical Address *</label>
                <input
                  type="text"
                  placeholder="e.g. Plot 44, Jinja Road"
                  value={modalData.address || ''}
                  onChange={(e) => setModalData({ ...modalData, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-800"
                  required
                />
                {modalErrors.address && <p className="mt-1 text-rose-600">{modalErrors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch Manager *</label>
                  <input
                    type="text"
                    placeholder="e.g. David Mugisha"
                    value={modalData.manager || ''}
                    onChange={(e) => setModalData({ ...modalData, manager: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Geofence Radius</label>
                  <select
                    value={modalData.radius || '100m'}
                    onChange={(e) => setModalData({ ...modalData, radius: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white"
                  >
                    <option value="50m">50 meters</option>
                    <option value="100m">100 meters</option>
                    <option value="150m">150 meters</option>
                    <option value="250m">250 meters</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clock-in Rule</label>
                  <select
                    value={modalData.clockIn || 'QR at counter'}
                    onChange={(e) => setModalData({ ...modalData, clockIn: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white"
                  >
                    <option value="QR at counter">QR at counter</option>
                    <option value="QR + GPS 100 m">QR + GPS 100 m</option>
                    <option value="Device + GPS 100 m">Device + GPS 100 m</option>
                    <option value="QR + Face check">QR + Face check</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00–17:00 Mon–Fri"
                    value={modalData.hours || ''}
                    onChange={(e) => setModalData({ ...modalData, hours: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0b1329] px-4 py-2 font-semibold text-white hover:bg-slate-800"
                >
                  Save branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add / Edit Department Modal ────────────────────── */}
      {(activeModal === 'addDept' || activeModal === 'editDept') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {activeModal === 'addDept' ? 'Add Department' : 'Edit Department'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveDept} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Quality Assurance"
                  value={modalData.name || ''}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-800"
                  required
                />
                {modalErrors.name && <p className="mt-1 text-rose-600">{modalErrors.name}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Head of Department *</label>
                <input
                  type="text"
                  placeholder="e.g. Esther Akello"
                  value={modalData.head || ''}
                  onChange={(e) => setModalData({ ...modalData, head: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-800"
                  required
                />
                {modalErrors.head && <p className="mt-1 text-rose-600">{modalErrors.head}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Staff</label>
                  <input
                    type="number"
                    min="0"
                    value={modalData.staff || 0}
                    onChange={(e) => setModalData({ ...modalData, staff: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch Locations</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={modalData.branchCount || 1}
                    onChange={(e) => setModalData({ ...modalData, branchCount: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0b1329] px-4 py-2 font-semibold text-white hover:bg-slate-800"
                >
                  Save department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add / Edit Position Modal ──────────────────────── */}
      {(activeModal === 'addPos' || activeModal === 'editPos') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {activeModal === 'addPos' ? 'Add Job Position' : 'Edit Job Position'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePos} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Position Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Inventory Clerk"
                  value={modalData.title || ''}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-800"
                  required
                />
                {modalErrors.title && <p className="mt-1 text-rose-600">{modalErrors.title}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={modalData.department || 'Sales'}
                  onChange={(e) => setModalData({ ...modalData, department: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grade</label>
                  <select
                    value={modalData.grade || 'G2'}
                    onChange={(e) => setModalData({ ...modalData, grade: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white"
                  >
                    <option value="G1">G1 (Entry)</option>
                    <option value="G2">G2 (Associate)</option>
                    <option value="G3">G3 (Senior / Lead)</option>
                    <option value="G4">G4 (Manager)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pay Range (UGX)</label>
                  <input
                    type="text"
                    placeholder="e.g. 700K – 1.1M"
                    value={modalData.payRange || ''}
                    onChange={(e) => setModalData({ ...modalData, payRange: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Filled / Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 / 6"
                    value={modalData.filled || ''}
                    onChange={(e) => setModalData({ ...modalData, filled: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hiring Status</label>
                  <select
                    value={modalData.hiring ? 'true' : 'false'}
                    onChange={(e) => setModalData({ ...modalData, hiring: e.target.value === 'true' })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white font-semibold"
                  >
                    <option value="true">Actively Hiring</option>
                    <option value="false">Filled / Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0b1329] px-4 py-2 font-semibold text-white hover:bg-slate-800"
                >
                  Save position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ─────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs">
            <div className="flex items-center gap-2 text-rose-600 font-bold mb-2">
              <AlertTriangle size={18} />
              <span>Confirm Deletion</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to delete {deleteTarget.type === 'branch' ? 'branch' : deleteTarget.type === 'dept' ? 'department' : 'position'}{' '}
              <span className="font-bold text-slate-900">&ldquo;{deleteTarget.name}&rdquo;</span>?
            </p>
            <p className="mt-1 text-slate-400">This action can be reset from sample data settings.</p>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
