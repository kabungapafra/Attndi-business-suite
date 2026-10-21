import { useState, useMemo } from 'react'
import {
  Search,
  Upload,
  Download,
  Eye,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Filter,
  Bell,
} from 'lucide-react'

const STORAGE_KEY_DOCS = 'attndi_documents_data'

const INITIAL_DOCUMENTS = [
  {
    id: 'doc-1',
    name: 'Employee handbook 2026',
    type: 'PDF',
    belongsTo: 'Company',
    category: 'Company policies',
    uploaded: '12 Jan 2026',
    expires: '—',
    viewer: 'Everyone',
    status: 'Published',
    tone: 'published',
    size: '2.4 MB',
    description: 'General employee code of conduct, company values, and attendance policies.',
  },
  {
    id: 'doc-2',
    name: 'Fuel & transport policy',
    type: 'PDF',
    belongsTo: 'Company',
    category: 'Company policies',
    uploaded: '3 Aug 2026',
    expires: '—',
    viewer: 'Everyone',
    status: 'Published',
    tone: 'published',
    size: '1.1 MB',
    description: 'Vehicle requisition rules, mileage allowance reimbursement and fuel cards.',
  },
  {
    id: 'doc-3',
    name: 'Employment contract',
    type: 'DOC',
    belongsTo: 'Ivan Kizza',
    category: 'Employment contracts',
    uploaded: '1 Aug 2023',
    expires: '31 Oct 2026',
    viewer: 'Employee + HR',
    status: 'Ends soon',
    tone: 'endsSoon',
    expiresWarn: true,
    size: '450 KB',
    description: 'Fixed term sales contract expiring in October 2026.',
  },
  {
    id: 'doc-4',
    name: 'Employment contract',
    type: 'DOC',
    belongsTo: 'Joseph Okello',
    category: 'Employment contracts',
    uploaded: '8 Jan 2024',
    expires: '14 Oct 2026',
    viewer: 'Employee + HR',
    status: 'Ends soon',
    tone: 'endsSoon',
    expiresWarn: true,
    size: '420 KB',
    description: 'Logistics driver contract up for quarterly renewal.',
  },
  {
    id: 'doc-5',
    name: 'Employment contract',
    type: 'DOC',
    belongsTo: 'Paul Lubega',
    category: 'Employment contracts',
    uploaded: '14 Sep 2026',
    expires: '13 Sep 2027',
    viewer: 'Employee + HR',
    status: 'Awaiting signature',
    tone: 'awaiting',
    size: '510 KB',
    description: 'Sales associate contract awaiting digital counter-signature.',
  },
  {
    id: 'doc-6',
    name: 'National ID copy',
    type: 'JPG',
    belongsTo: 'Sarah Namutebi',
    category: 'ID & NSSF records',
    uploaded: '6 Feb 2023',
    expires: '—',
    viewer: 'HR only',
    status: 'Verified',
    tone: 'verified',
    size: '850 KB',
    description: 'Verified National Identification card front and back scan.',
  },
  {
    id: 'doc-7',
    name: 'Driving permit',
    type: 'PDF',
    belongsTo: 'Joseph Okello',
    category: 'Certificates',
    uploaded: '8 Jan 2024',
    expires: '28 Oct 2026',
    viewer: 'HR only',
    status: 'Expires soon',
    tone: 'expires',
    expiresWarn: true,
    size: '1.2 MB',
    description: 'Commercial vehicle driving license class B/CM.',
  },
  {
    id: 'doc-8',
    name: 'Medical fitness form',
    type: 'PDF',
    belongsTo: 'Sarah Namutebi',
    category: 'Certificates',
    uploaded: '—',
    expires: '—',
    viewer: 'HR only',
    status: 'Missing',
    tone: 'missing',
    size: '0 KB',
    description: 'Pre-employment health clearance form required by food safety regulations.',
  },
  {
    id: 'doc-9',
    name: 'Warning letter - lateness',
    type: 'PDF',
    belongsTo: 'Moses Waiswa',
    category: 'Disciplinary',
    uploaded: '19 Sep 2026',
    expires: '—',
    viewer: 'Employee + HR',
    status: 'Acknowledged',
    tone: 'acknowledged',
    size: '220 KB',
    description: 'First formal notice for recurring clock-in lateness at Mukono Warehouse.',
  },
  {
    id: 'doc-10',
    name: 'Diploma in accounting',
    type: 'PDF',
    belongsTo: 'Esther Akello',
    category: 'Certificates',
    uploaded: '2 Jan 2020',
    expires: '—',
    viewer: 'HR only',
    status: 'Verified',
    tone: 'verified',
    size: '3.1 MB',
    description: 'Uganda College of Commerce certified academic transcript.',
  },
  {
    id: 'doc-11',
    name: 'Job offer letter',
    type: 'PDF',
    belongsTo: 'Fiona Achieng',
    category: 'Employment contracts',
    uploaded: '20 Aug 2026',
    expires: '—',
    viewer: 'Employee + HR',
    status: 'Signed',
    tone: 'signed',
    size: '340 KB',
    description: 'Official probation appointment letter signed by management.',
  },
]

const CATEGORY_NAMES = [
  'All documents',
  'Company policies',
  'Employment contracts',
  'ID & NSSF records',
  'Certificates',
  'Disciplinary',
  'Payslip archive',
]

const statusClasses = {
  published: 'bg-sky-50 text-sky-800 border border-sky-200',
  endsSoon: 'bg-amber-50 text-amber-800 border border-amber-200',
  awaiting: 'bg-violet-50 text-violet-800 border border-violet-200',
  verified: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  expires: 'bg-rose-50 text-rose-800 border border-rose-200',
  missing: 'bg-rose-100 text-rose-900 font-bold',
  acknowledged: 'bg-blue-50 text-blue-800 border border-blue-200',
  signed: 'bg-slate-100 text-slate-700 border border-slate-200',
}

const typeIconColor = {
  PDF: 'bg-blue-50 text-blue-700 border-blue-100',
  DOC: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  JPG: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  PNG: 'bg-purple-50 text-purple-700 border-purple-100',
}

const CONTRACT_TEMPLATES = [
  { name: 'Standard Full-Time Employment Contract', format: 'DOCX', size: '120 KB', category: 'Permanent Staff' },
  { name: 'Fixed-Term Sales Rep Contract', format: 'DOCX', size: '98 KB', category: 'Contract Staff' },
  { name: 'Confidentiality & Non-Disclosure Agreement', format: 'PDF', size: '150 KB', category: 'General' },
  { name: 'Casual Worker Daily Agreement', format: 'DOCX', size: '65 KB', category: 'Casual & Logistics' },
  { name: 'Formal Disciplinary Warning Notice Template', format: 'DOCX', size: '82 KB', category: 'HR Administration' },
]

function getStoredDocs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DOCS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(INITIAL_DOCUMENTS))
      return INITIAL_DOCUMENTS
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DOCUMENTS
  } catch {
    return INITIAL_DOCUMENTS
  }
}

export default function DocumentsDashboard() {
  const [documents, setDocuments] = useState(getStoredDocs)
  const [activeCategory, setActiveCategory] = useState('All documents')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [feedback, setFeedback] = useState(null)

  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
  const [previewDoc, setPreviewDoc] = useState(null)
  const [editingDoc, setEditingDoc] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Upload Form state
  const [uploadForm, setUploadForm] = useState({
    name: '',
    belongsTo: 'Company',
    category: 'Company policies',
    viewer: 'Everyone',
    expires: '',
    status: 'Published',
    description: '',
  })
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadError, setUploadError] = useState('')

  const showNotification = (msg, type = 'success') => {
    setFeedback({ msg, type })
    setTimeout(() => setFeedback(null), 4000)
  }

  const saveDocsToStorage = (updated) => {
    setDocuments(updated)
    localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(updated))
  }

  // Calculate dynamic category counts
  const categoryCounts = useMemo(() => {
    const counts = { 'All documents': documents.length }
    CATEGORY_NAMES.slice(1).forEach((cat) => {
      counts[cat] = documents.filter((d) => d.category === cat).length
    })
    return counts
  }, [documents])

  // Needs attention calculations
  const endsSoonDocs = useMemo(() => documents.filter((d) => d.expiresWarn || d.status === 'Ends soon'), [documents])
  const missingDocs = useMemo(() => documents.filter((d) => d.status === 'Missing'), [documents])

  // Filtered documents table
  const filteredDocuments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return documents.filter((doc) => {
      // Category filter
      if (activeCategory !== 'All documents' && doc.category !== activeCategory) {
        return false
      }

      // Status filter
      if (statusFilter !== 'All' && doc.status !== statusFilter) {
        return false
      }

      // Search filter
      if (q) {
        const matchesName = doc.name?.toLowerCase().includes(q)
        const matchesBelongs = doc.belongsTo?.toLowerCase().includes(q)
        const matchesCategory = doc.category?.toLowerCase().includes(q)
        const matchesType = doc.type?.toLowerCase().includes(q)
        if (!matchesName && !matchesBelongs && !matchesCategory && !matchesType) {
          return false
        }
      }
      return true
    })
  }, [documents, activeCategory, statusFilter, searchQuery])

  // Handle File Input in Upload Modal
  const handleFileSelect = (e) => {
    setUploadError('')
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!allowed.includes(ext)) {
      setUploadError(`Unsupported file format .${ext}. Only PDF, DOCX, JPG and PNG are supported.`)
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB maximum limit.')
      return
    }

    setUploadedFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: ext.toUpperCase() === 'JPEG' ? 'JPG' : ext.toUpperCase(),
    })

    if (!uploadForm.name) {
      setUploadForm((prev) => ({ ...prev, name: file.name.replace(/\.[^/.]+$/, '') }))
    }
  }

  // Handle Upload Submission
  const handleSaveUpload = (e) => {
    e.preventDefault()
    if (!uploadForm.name.trim()) {
      setUploadError('Document title is required')
      return
    }

    const type = uploadedFile ? uploadedFile.type : 'PDF'
    const size = uploadedFile ? uploadedFile.size : '1.0 MB'

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: uploadForm.name.trim(),
      type,
      belongsTo: uploadForm.belongsTo.trim() || 'Company',
      category: uploadForm.category,
      uploaded: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      expires: uploadForm.expires ? new Date(uploadForm.expires).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
      viewer: uploadForm.viewer,
      status: uploadForm.status,
      tone: uploadForm.status === 'Verified' ? 'verified' : uploadForm.status === 'Signed' ? 'signed' : 'published',
      size,
      description: uploadForm.description || 'Uploaded document record.',
    }

    const updated = [newDoc, ...documents]
    saveDocsToStorage(updated)
    setShowUploadModal(false)
    setUploadedFile(null)
    setUploadForm({
      name: '',
      belongsTo: 'Company',
      category: 'Company policies',
      viewer: 'Everyone',
      expires: '',
      status: 'Published',
      description: '',
    })
    showNotification(`Uploaded document "${newDoc.name}" successfully!`)
  }

  // Handle Edit Submission
  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editingDoc) return

    const updated = documents.map((d) => (d.id === editingDoc.id ? { ...editingDoc } : d))
    saveDocsToStorage(updated)
    setEditingDoc(null)
    showNotification(`Updated document "${editingDoc.name}"`)
  }

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    const updated = documents.filter((d) => d.id !== deleteTarget.id)
    saveDocsToStorage(updated)
    setDeleteTarget(null)
    showNotification(`Deleted document "${deleteTarget.name}"`)
  }

  // Demo File Download Simulator
  const handleDownloadFile = (doc) => {
    const content = `ATTNDI BUSINESS SUITE – DOCUMENT EXPORT
Title: ${doc.name}
Belongs To: ${doc.belongsTo}
Category: ${doc.category}
Uploaded Date: ${doc.uploaded}
Expiry Date: ${doc.expires}
Access: ${doc.viewer}
Status: ${doc.status}
Size: ${doc.size || 'Standard'}

Content Summary:
${doc.description || 'Official document archived in Attndi Business Suite.'}
Generated at: ${new Date().toISOString()}`

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${doc.name.replace(/\s+/g, '_')}.${doc.type.toLowerCase() === 'doc' ? 'txt' : 'txt'}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showNotification(`Downloaded file for "${doc.name}"`)
  }

  // Remind by SMS action
  const handleRemindBySms = () => {
    showNotification(`Simulated SMS reminder dispatched to ${endsSoonDocs.length + missingDocs.length} employees with expiring or missing documents!`)
  }

  return (
    <div className="min-w-0 flex-1 bg-[#f3f4f6]">
      {/* Toast Feedback */}
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
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">People · Documents</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Documents &amp; contracts
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Manage organizational policies, contracts, compliance certificates, and employee records.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTemplatesModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <FileText size={13} />
              <span>Contract templates</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUploadError('')
                setShowUploadModal(true)
              }}
              className="flex items-center gap-1.5 rounded-xl bg-[#0b1329] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Upload size={13} />
              <span>Upload document</span>
            </button>
          </div>
        </div>

        {/* ── Search + Filter Bar ────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            <div className="relative min-w-[240px] max-w-sm flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search document name, employee, or category..."
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

            <label className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50">
              <span className="text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer pr-1"
              >
                <option value="All">All statuses</option>
                <option value="Published">Published</option>
                <option value="Verified">Verified</option>
                <option value="Signed">Signed</option>
                <option value="Ends soon">Ends soon</option>
                <option value="Awaiting signature">Awaiting signature</option>
                <option value="Expires soon">Expires soon</option>
                <option value="Missing">Missing</option>
              </select>
            </label>

            {(searchQuery || statusFilter !== 'All' || activeCategory !== 'All documents') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('All')
                  setActiveCategory('All documents')
                }}
                className="text-xs font-semibold text-blue-600 hover:underline px-2"
              >
                Reset filters
              </button>
            )}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredDocuments.length} of {documents.length} records
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
          {/* ── Left Column: Categories + Needs Attention ───── */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
                Categories
              </p>
              <div className="space-y-1">
                {CATEGORY_NAMES.map((category) => {
                  const active = activeCategory === category
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={[
                        'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition',
                        active
                          ? 'bg-[#0b1329] font-bold text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <span className="truncate pr-2">{category}</span>
                      <span
                        className={`shrink-0 text-xs tabular-nums font-semibold ${
                          active ? 'text-slate-300' : 'text-slate-400'
                        }`}
                      >
                        ({categoryCounts[category] || 0})
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Needs Attention Card */}
            <div className="rounded-2xl border border-amber-200 bg-[#fdf6ee] p-4 shadow-sm">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                <Bell size={14} className="text-amber-600" />
                <span>Needs attention</span>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>
                    <strong className="text-slate-900">{endsSoonDocs.length}</strong> contracts end within 30 days
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span>
                    <strong className="text-slate-900">{missingDocs.length}</strong> staff missing required document
                  </span>
                </li>
              </ul>
              <button
                type="button"
                onClick={handleRemindBySms}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 underline underline-offset-2 hover:text-blue-900"
              >
                Remind staff by SMS →
              </button>
            </div>
          </aside>

          {/* ── Right Column: Documents Table ────────────────── */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] border-separate border-spacing-0 text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wide text-slate-400 bg-[#fbfaf8]">
                    <th className="border-b border-slate-100 px-4 py-3.5">DOCUMENT</th>
                    <th className="border-b border-slate-100 px-4 py-3.5">BELONGS TO</th>
                    <th className="border-b border-slate-100 px-4 py-3.5">CATEGORY</th>
                    <th className="border-b border-slate-100 px-4 py-3.5">UPLOADED</th>
                    <th className="border-b border-slate-100 px-4 py-3.5">EXPIRES</th>
                    <th className="border-b border-slate-100 px-4 py-3.5">WHO CAN SEE</th>
                    <th className="border-b border-slate-100 px-4 py-3.5">STATUS</th>
                    <th className="border-b border-slate-100 px-4 py-3.5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                          <Filter size={24} className="text-slate-300 mb-2" />
                          <p className="font-semibold text-slate-700">No documents found</p>
                          <p className="mt-1 text-xs text-slate-400">
                            Try selecting another category or resetting your search.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCategory('All documents')
                              setSearchQuery('')
                              setStatusFilter('All')
                            }}
                            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Reset view
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="align-middle hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <span
                              className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-[10px] font-bold ${
                                typeIconColor[doc.type] || 'bg-slate-50 text-slate-600 border-slate-200'
                              }`}
                            >
                              {doc.type}
                            </span>
                            <div>
                              <p className="font-semibold text-slate-900 whitespace-nowrap">{doc.name}</p>
                              {doc.size && <span className="text-[10px] text-slate-400">{doc.size}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-700">
                          {doc.belongsTo}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                          {doc.category}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 font-medium">
                          {doc.uploaded}
                        </td>
                        <td
                          className={`px-4 py-3.5 whitespace-nowrap ${
                            doc.expiresWarn ? 'font-bold text-amber-700' : 'text-slate-600'
                          }`}
                        >
                          {doc.expires}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                          {doc.viewer}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              statusClasses[doc.tone] || statusClasses.published
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setPreviewDoc(doc)}
                              title="View details"
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadFile(doc)}
                              title="Download document"
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                            >
                              <Download size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingDoc({ ...doc })}
                              title="Edit record"
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(doc)}
                              title="Delete record"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* ── Upload Document Modal ──────────────────────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl my-8 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upload Document</h3>
                <p className="text-slate-400">Add an organizational policy or employee file</p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="mt-4 space-y-3">
              {uploadError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* File upload area */}
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-slate-500">
                <Upload size={22} className="text-slate-400 mb-1" />
                <span className="font-semibold text-slate-700">
                  {uploadedFile ? uploadedFile.name : 'Click to select or drop document'}
                </span>
                <span className="mt-0.5 text-[11px] text-slate-400">
                  {uploadedFile ? `${uploadedFile.size} · ${uploadedFile.type}` : 'PDF, DOCX, JPG or PNG (up to 10MB)'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="sr-only"
                />
              </label>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sales Commission Scheme Q4"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Belongs to</label>
                  <input
                    type="text"
                    placeholder="e.g. Company or Employee Name"
                    value={uploadForm.belongsTo}
                    onChange={(e) => setUploadForm({ ...uploadForm, belongsTo: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white"
                  >
                    {CATEGORY_NAMES.slice(1).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Who can view</label>
                  <select
                    value={uploadForm.viewer}
                    onChange={(e) => setUploadForm({ ...uploadForm, viewer: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white"
                  >
                    <option value="Everyone">Everyone</option>
                    <option value="Employee + HR">Employee + HR</option>
                    <option value="HR only">HR only</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date (optional)</label>
                  <input
                    type="date"
                    value={uploadForm.expires}
                    onChange={(e) => setUploadForm({ ...uploadForm, expires: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional summary or notes about this document..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0b1329] px-4 py-2 font-semibold text-white hover:bg-slate-800"
                >
                  Save &amp; upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Document Preview Modal ──────────────────────────── */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className={`grid h-7 w-7 place-items-center rounded-lg text-[10px] font-bold ${typeIconColor[previewDoc.type] || 'bg-blue-50 text-blue-800'}`}>
                  {previewDoc.type}
                </span>
                <h3 className="text-base font-bold text-slate-900">{previewDoc.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-slate-500 mb-1">Document Summary:</p>
                <p className="font-medium text-slate-800 leading-relaxed">{previewDoc.description}</p>
              </div>

              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-slate-400">Category</dt>
                  <dd className="font-semibold text-slate-800">{previewDoc.category}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Belongs to</dt>
                  <dd className="font-semibold text-slate-800">{previewDoc.belongsTo}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Uploaded on</dt>
                  <dd className="font-semibold text-slate-800">{previewDoc.uploaded}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Expiry date</dt>
                  <dd className="font-semibold text-slate-800">{previewDoc.expires}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Visibility</dt>
                  <dd className="font-semibold text-slate-800">{previewDoc.viewer}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Status</dt>
                  <dd className="font-semibold text-slate-800">{previewDoc.status}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 flex justify-between items-center border-t border-slate-100 pt-3">
              <span className="text-slate-400 font-mono text-[11px]">{previewDoc.size || '1.0 MB'}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDownloadFile(previewDoc)
                    setPreviewDoc(null)
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#0b1329] px-4 py-2 font-semibold text-white hover:bg-slate-800"
                >
                  <Download size={13} />
                  <span>Download file</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Document Modal ─────────────────────────────── */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Document</h3>
              <button
                type="button"
                onClick={() => setEditingDoc(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  value={editingDoc.name}
                  onChange={(e) => setEditingDoc({ ...editingDoc, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingDoc.category}
                    onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white"
                  >
                    {CATEGORY_NAMES.slice(1).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Belongs To</label>
                  <input
                    type="text"
                    value={editingDoc.belongsTo}
                    onChange={(e) => setEditingDoc({ ...editingDoc, belongsTo: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingDoc.status}
                    onChange={(e) => setEditingDoc({ ...editingDoc, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white font-semibold"
                  >
                    <option value="Published">Published</option>
                    <option value="Verified">Verified</option>
                    <option value="Signed">Signed</option>
                    <option value="Ends soon">Ends soon</option>
                    <option value="Awaiting signature">Awaiting signature</option>
                    <option value="Missing">Missing</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Visibility</label>
                  <select
                    value={editingDoc.viewer}
                    onChange={(e) => setEditingDoc({ ...editingDoc, viewer: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none bg-white"
                  >
                    <option value="Everyone">Everyone</option>
                    <option value="Employee + HR">Employee + HR</option>
                    <option value="HR only">HR only</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0b1329] px-4 py-2 font-semibold text-white hover:bg-slate-800"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Contract Templates Modal ───────────────────────── */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Standard Contract Templates</h3>
                <p className="text-slate-400">Pre-approved HR agreements ready for onboarding</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplatesModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <ul className="mt-4 divide-y divide-slate-100 space-y-2">
              {CONTRACT_TEMPLATES.map((tmpl) => (
                <li key={tmpl.name} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <FileText size={18} className="text-blue-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">{tmpl.name}</p>
                      <p className="text-[10px] text-slate-400">{tmpl.category} · {tmpl.size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleDownloadFile({ name: tmpl.name, belongsTo: 'Company', category: 'Templates', type: tmpl.format, uploaded: 'Standard', expires: '—', viewer: 'HR only', status: 'Template' })
                    }}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <Download size={12} />
                    <span>Download</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex justify-end border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowTemplatesModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ─────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs">
            <div className="flex items-center gap-2 text-rose-600 font-bold mb-2">
              <AlertTriangle size={18} />
              <span>Delete Document</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete document{' '}
              <span className="font-bold text-slate-900">&ldquo;{deleteTarget.name}&rdquo;</span>?
            </p>
            <p className="mt-1 text-slate-400">This action removes the record from the dashboard.</p>

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
