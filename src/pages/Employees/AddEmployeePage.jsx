/**
 * AddEmployeePage.jsx
 * Six-step wizard for onboarding a new employee with full validation,
 * local draft storage, and integration with employeeService.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, FileText, Trash2, Upload, AlertCircle } from 'lucide-react'
import StepTracker from '@components/StepTracker'
import JobPlacementForm from '@components/JobPlacementForm'
import SummaryCard from '@components/SummaryCard'
import { employeeService } from '@services/employeeService'

const stepTitles = [
  'Personal details',
  'Job & placement',
  'Contract & pay',
  'Schedule',
  'Documents',
  'Review & invite',
]

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10 shadow-sm'

const inputErrorClass =
  'w-full rounded-xl border border-rose-400 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10 shadow-sm'

function Field({ label, required, error, children }) {
  return (
    <label className="block text-xs font-semibold text-slate-700">
      <span className="mb-1.5 flex items-center justify-between">
        <span>
          {label} {required && <span className="text-rose-500">*</span>}
        </span>
      </span>
      {children}
      {error && <span className="mt-1 block text-[11px] font-medium text-rose-600">{error}</span>}
    </label>
  )
}

const dropdowns = {
  jobPositions: ['Sales Associate', 'Store Manager', 'Inventory Clerk', 'Cashier', 'Driver', 'Loader', 'Shift Supervisor'],
  departments: ['Sales', 'Operations', 'Finance', 'Human resources', 'Warehouse', 'Logistics'],
  branches: ['Ntinda Store', 'Kampala HQ', 'Mukono Warehouse', 'Entebbe Depot', 'Wakiso route'],
  managers: ['David Mugisha', 'Ruth Nabirye', 'Grace Atim', 'Esther Akello', 'Martin Kato'],
  roles: ['Employee', 'Supervisor', 'Manager', 'Admin'],
}

const defaultForm = {
  fullName: 'Brenda Nankya',
  phone: '0741 226 590',
  email: 'brenda.n@nilefresh.co.ug',
  jobPosition: 'Sales Associate',
  department: 'Sales',
  branch: 'Ntinda Store',
  reportsTo: 'David Mugisha',
  startDate: '2026-10-05',
  appRole: 'Employee',
  employmentType: 'Permanent',
  salary: '1200000',
  paymentFrequency: 'Monthly',
  shift: 'Day Shift (8:00 AM - 5:00 PM)',
  clockInMethods: { qr: true, gps: true, officeDevice: false, faceCheck: true },
}

const FORM_STORAGE_KEY = 'attndi_employee_draft'

export default function AddEmployeePage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY)
      return saved ? { ...defaultForm, ...JSON.parse(saved) } : defaultForm
    } catch {
      return defaultForm
    }
  })

  const [errors, setErrors] = useState({})
  const [saveMessage, setSaveMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [documents, setDocuments] = useState([])
  const [docError, setDocError] = useState('')

  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData))
  }, [formData])

  const updateForm = (key, value) => {
    setFormData((previous) => ({ ...previous, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  // Validation per step
  const validateStep = (step) => {
    const errs = {}
    if (step === 1) {
      if (!formData.fullName?.trim() || formData.fullName.trim().length < 2) {
        errs.fullName = 'Please enter a valid full name (minimum 2 characters)'
      }
      if (!formData.phone?.trim()) {
        errs.phone = 'Phone number is required'
      } else if (!/^[0-9+\s()-]{7,16}$/.test(formData.phone.trim())) {
        errs.phone = 'Please enter a valid phone number format'
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errs.email = 'Please enter a valid email address'
      }
    } else if (step === 2) {
      if (!formData.jobPosition) errs.jobPosition = 'Job position is required'
      if (!formData.department) errs.department = 'Department is required'
      if (!formData.branch) errs.branch = 'Branch is required'
    } else if (step === 3) {
      if (!formData.salary || Number(formData.salary) <= 0) {
        errs.salary = 'Please enter a valid monthly salary amount'
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return
    setSaveMessage('')
    setCurrentStep((step) => Math.min(6, step + 1))
  }

  const handleSaveDraft = () => {
    localStorage.setItem(
      FORM_STORAGE_KEY,
      JSON.stringify({
        ...formData,
        documents: documents.map((d) => d.name),
        savedAt: new Date().toISOString(),
      })
    )
    setSaveMessage('Draft saved locally.')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleFileUpload = (e) => {
    setDocError('')
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
    const maxSize = 10 * 1024 * 1024 // 10MB

    const validFiles = []
    for (const f of files) {
      if (!allowedTypes.includes(f.type) && !/\.(pdf|doc|docx|jpg|jpeg|png)$/i.test(f.name)) {
        setDocError(`Unsupported file format: ${f.name}. Only PDF, DOCX, JPG, and PNG are allowed.`)
        return
      }
      if (f.size > maxSize) {
        setDocError(`File too large: ${f.name} exceeds 10MB limit.`)
        return
      }
      validFiles.push({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: f.name.endsWith('.pdf') ? 'PDF' : f.name.endsWith('.docx') || f.name.endsWith('.doc') ? 'DOC' : 'IMG',
        uploadedAt: 'Just now',
      })
    }

    setDocuments((prev) => [...prev, ...validFiles])
  }

  const handleRemoveDoc = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFinish = () => {
    // Validate all required steps
    for (let s = 1; s <= 3; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s)
        return
      }
    }

    const newEmp = employeeService.create({
      ...formData,
      documents,
    })

    localStorage.removeItem(FORM_STORAGE_KEY)
    setIsSuccess(true)
    setSaveMessage(`Employee ${newEmp.name} created successfully with ID ${newEmp.id}!`)

    setTimeout(() => {
      navigate(`/employees/${newEmp.id}`)
    }, 1500)
  }

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <header>
            <h2 className="text-xl font-bold text-slate-900">Personal details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Basic identification and contact details for the new employee profile.
            </p>
          </header>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" required error={errors.fullName}>
              <input
                className={errors.fullName ? inputErrorClass : inputClass}
                placeholder="e.g. Brenda Nankya"
                value={formData.fullName}
                onChange={(event) => updateForm('fullName', event.target.value)}
              />
            </Field>
            <Field label="Phone number" required error={errors.phone}>
              <input
                className={errors.phone ? inputErrorClass : inputClass}
                type="tel"
                placeholder="e.g. 0741 226 590"
                value={formData.phone}
                onChange={(event) => updateForm('phone', event.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Email address" error={errors.email}>
                <input
                  className={errors.email ? inputErrorClass : inputClass}
                  type="email"
                  placeholder="e.g. brenda.n@nilefresh.co.ug"
                  value={formData.email}
                  onChange={(event) => updateForm('email', event.target.value)}
                />
              </Field>
            </div>
          </div>
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <JobPlacementForm
          formData={formData}
          options={dropdowns}
          setFormData={setFormData}
        />
      )
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-6">
          <header>
            <h2 className="text-xl font-bold text-slate-900">Contract &amp; pay</h2>
            <p className="mt-1 text-sm text-slate-500">Configure compensation and payment settings.</p>
          </header>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Monthly salary (UGX)" required error={errors.salary}>
              <input
                className={errors.salary ? inputErrorClass : inputClass}
                type="number"
                min="0"
                step="50000"
                value={formData.salary}
                onChange={(event) => updateForm('salary', event.target.value)}
              />
            </Field>
            <Field label="Payment frequency">
              <select
                className={inputClass}
                value={formData.paymentFrequency}
                onChange={(event) => updateForm('paymentFrequency', event.target.value)}
              >
                <option value="Monthly">Monthly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </Field>
          </div>
        </div>
      )
    }

    if (currentStep === 4) {
      return (
        <div className="space-y-6">
          <header>
            <h2 className="text-xl font-bold text-slate-900">Schedule</h2>
            <p className="mt-1 text-sm text-slate-500">Set up the employee&apos;s shift pattern.</p>
          </header>
          <Field label="Shift assignment">
            <select
              className={inputClass}
              value={formData.shift}
              onChange={(event) => updateForm('shift', event.target.value)}
            >
              <option value="Day Shift (8:00 AM - 5:00 PM)">Day Shift (8:00 AM - 5:00 PM)</option>
              <option value="Evening Shift (1:00 PM - 10:00 PM)">Evening Shift (1:00 PM - 10:00 PM)</option>
              <option value="Night Shift (10:00 PM - 7:00 AM)">Night Shift (10:00 PM - 7:00 AM)</option>
            </select>
          </Field>
        </div>
      )
    }

    if (currentStep === 5) {
      return (
        <div className="space-y-6">
          <header>
            <h2 className="text-xl font-bold text-slate-900">Documents</h2>
            <p className="mt-1 text-sm text-slate-500">Attach identity cards, contracts, or certificates.</p>
          </header>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-slate-500">
            <Upload size={24} className="text-slate-400 mb-2" />
            <span className="text-xs font-semibold text-slate-700">Choose files to upload</span>
            <span className="mt-1 text-[11px] text-slate-500">PDF, DOC, DOCX, JPG or PNG (up to 10MB)</span>
            <input
              className="sr-only"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
            />
          </label>

          {docError && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle size={14} className="shrink-0" />
              <span>{docError}</span>
            </div>
          )}

          {documents.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-700">Attached files ({documents.length}):</p>
              <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                {documents.map((file, idx) => (
                  <li key={`${file.name}-${idx}`} className="flex items-center justify-between p-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText size={16} className="text-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-800">{file.name}</p>
                        <p className="text-[10px] text-slate-400">{file.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(idx)}
                      className="rounded-lg p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-50"
                      title="Remove document"
                    >
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-5">
        <header>
          <h2 className="text-xl font-bold text-slate-900">Review &amp; invite</h2>
          <p className="mt-1 text-sm text-slate-500">Confirm the details before sending the invitation.</p>
        </header>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900">
          <p className="font-semibold">Ready to send the employee invitation.</p>
          <p className="mt-1 text-emerald-800">
            An invitation SMS will be sent to <span className="font-bold">{formData.phone || 'the registered number'}</span> upon submission.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-xs bg-slate-50 rounded-xl p-4 border border-slate-200">
          <dt className="text-slate-500">Full Name</dt>
          <dd className="text-right font-semibold text-slate-800">{formData.fullName}</dd>

          <dt className="text-slate-500">Position</dt>
          <dd className="text-right font-semibold text-slate-800">{formData.jobPosition}</dd>

          <dt className="text-slate-500">Department</dt>
          <dd className="text-right font-semibold text-slate-800">{formData.department}</dd>

          <dt className="text-slate-500">Branch</dt>
          <dd className="text-right font-semibold text-slate-800">{formData.branch}</dd>

          <dt className="text-slate-500">Employment Type</dt>
          <dd className="text-right font-semibold text-slate-800">{formData.employmentType}</dd>

          <dt className="text-slate-500">Monthly Salary</dt>
          <dd className="text-right font-semibold text-slate-800">UGX {Number(formData.salary || 0).toLocaleString()}</dd>

          <dt className="text-slate-500">Shift</dt>
          <dd className="text-right font-semibold text-slate-800">{formData.shift}</dd>

          <dt className="text-slate-500">Attached Documents</dt>
          <dd className="text-right font-semibold text-slate-800">{documents.length} file(s)</dd>
        </dl>
      </div>
    )
  }

  return (
    <div className="min-w-0 flex-1 bg-[#f8f7f4]">
      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 xl:px-8">
        <header className="pb-4">
          <nav className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-500">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="flex items-center gap-1 font-semibold text-blue-600 hover:underline"
            >
              <ArrowLeft size={12} />
              <span>Employees</span>
            </button>
            <span>/</span>
            <span className="text-slate-700">Add employee</span>
          </nav>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Add an employee
          </h1>
        </header>

        <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
          <div className="min-w-0 xl:pr-1">
            <StepTracker currentStep={currentStep} setCurrentStep={setCurrentStep} />
          </div>

          <section className="flex min-h-[480px] flex-col justify-between rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm sm:min-h-[560px]">
            <div>{renderStep()}</div>

            <div className="mt-8 border-t border-[#f0ece5] pt-4">
              {saveMessage && (
                <div
                  className={`mb-3 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                    isSuccess ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {isSuccess && <Check size={14} className="text-emerald-600" />}
                  <span>{saveMessage}</span>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}
                  className="order-2 rounded-xl border border-[#e2ddd5] bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:order-1"
                >
                  Back
                </button>

                <div className="order-1 flex flex-wrap gap-2 sm:order-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="rounded-xl border border-[#e2ddd5] bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Save draft
                  </button>

                  {currentStep < 6 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="rounded-xl bg-[#0b1329] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      Continue to {stepTitles[currentStep]}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinish}
                      className="rounded-xl bg-[#0b1329] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      Finish &amp; send invite
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          <aside className="grid min-w-0 gap-4 sm:grid-cols-2 lg:col-span-2 xl:col-span-1 xl:grid-cols-1 xl:pl-1">
            <SummaryCard formData={{ ...formData, employeeId: 'Auto-assigned' }} />
          </aside>
        </div>
      </div>
    </div>
  )
}
