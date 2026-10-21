/**
 * employeeService.js
 * Comprehensive employee management service.
 * Manages employee data with local persistence (localStorage)
 * and structured interfaces ready for REST API integration.
 */

const STORAGE_KEY = 'attndi_employees_data'

export const INITIAL_EMPLOYEES = [
  {
    id: 'NF-0007',
    initials: 'RN',
    color: 'bg-blue-500',
    name: 'Ruth Nabirye',
    phone: '0772 418 903',
    email: 'ruth.n@nilefresh.co.ug',
    position: 'HR Manager',
    department: 'Human resources',
    branch: 'Kampala HQ',
    type: 'Permanent',
    started: 'Mar 2019',
    status: 'Active',
    salary: '3500000',
    paymentFrequency: 'Monthly',
    reportsTo: 'Pafra K.',
    shift: 'Day Shift (8:00 AM - 5:00 PM)',
    clockedIn: '07:45',
    nationalId: 'CM84019201RN7',
    nssfNumber: '1004928192',
    leaveDays: { annual: 16, annualTotal: 21, sick: 9, sickTotal: 10, emergency: 4, emergencyTotal: 4 },
  },
  {
    id: 'NF-0012',
    initials: 'EA',
    color: 'bg-teal-500',
    name: 'Esther Akello',
    phone: '0701 552 110',
    email: 'esther.a@nilefresh.co.ug',
    position: 'Finance Officer',
    department: 'Finance',
    branch: 'Kampala HQ',
    type: 'Permanent',
    started: 'Jan 2020',
    status: 'Active',
    salary: '2400000',
    paymentFrequency: 'Monthly',
    reportsTo: 'Moses Waiswa',
    shift: 'Day Shift (8:00 AM - 5:00 PM)',
    clockedIn: '08:02',
    nationalId: 'CF89028193EA2',
    nssfNumber: '1005829103',
    leaveDays: { annual: 12, annualTotal: 21, sick: 7, sickTotal: 10, emergency: 2, emergencyTotal: 4 },
  },
  {
    id: 'NF-0019',
    initials: 'DM',
    color: 'bg-orange-500',
    name: 'David Mugisha',
    phone: '0782 330 471',
    email: 'david.m@nilefresh.co.ug',
    position: 'Warehouse Supervisor',
    department: 'Warehouse',
    branch: 'Mukono Warehouse',
    type: 'Permanent',
    started: 'Jun 2020',
    status: 'Active',
    salary: '1800000',
    paymentFrequency: 'Monthly',
    reportsTo: 'Grace Atim',
    shift: 'Day Shift (8:00 AM - 5:00 PM)',
    clockedIn: '07:50',
    nationalId: 'CM87049182DM9',
    nssfNumber: '1006192849',
    leaveDays: { annual: 10, annualTotal: 21, sick: 10, sickTotal: 10, emergency: 3, emergencyTotal: 4 },
  },
  {
    id: 'NF-0044',
    initials: 'SN',
    color: 'bg-green-500',
    name: 'Sarah Namutebi',
    phone: '0756 907 214',
    email: 'sarah.n@nilefresh.co.ug',
    position: 'Sales Associate',
    department: 'Sales',
    branch: 'Ntinda Store',
    type: 'Permanent',
    started: 'Feb 2023',
    status: 'Active',
    salary: '1200000',
    paymentFrequency: 'Monthly',
    reportsTo: 'David Mugisha',
    shift: 'Day Shift (8:00 AM - 5:00 PM)',
    clockedIn: '07:58',
    nationalId: 'CF93019284SN4',
    nssfNumber: '1008492019',
    leaveDays: { annual: 14, annualTotal: 21, sick: 8, sickTotal: 10, emergency: 3, emergencyTotal: 4 },
  },
  {
    id: 'NF-0051',
    initials: 'IK',
    color: 'bg-purple-500',
    name: 'Ivan Kizza',
    phone: '0774 118 620',
    email: 'ivan.k@nilefresh.co.ug',
    position: 'Field Sales Rep',
    department: 'Sales',
    branch: 'Wakiso route',
    type: 'Contract',
    started: 'Aug 2023',
    status: 'Active',
    salary: '1100000',
    paymentFrequency: 'Monthly',
    reportsTo: 'Esther Akello',
    shift: 'Day Shift (8:00 AM - 5:00 PM)',
    clockedIn: '08:15',
    nationalId: 'CM95029103IK5',
    nssfNumber: '1009182940',
    leaveDays: { annual: 8, annualTotal: 15, sick: 6, sickTotal: 10, emergency: 2, emergencyTotal: 4 },
  },
  {
    id: 'NF-0058',
    initials: 'GA',
    color: 'bg-indigo-500',
    name: 'Grace Atim',
    phone: '0703 845 996',
    email: 'grace.a@nilefresh.co.ug',
    position: 'Store Keeper',
    department: 'Warehouse',
    branch: 'Mukono Warehouse',
    type: 'Permanent',
    started: 'Nov 2023',
    status: 'Active',
    salary: '1400000',
    paymentFrequency: 'Monthly',
    reportsTo: 'David Mugisha',
    shift: 'Day Shift (8:00 AM - 5:00 PM)',
    clockedIn: '07:55',
    nationalId: 'CF91038291GA8',
    nssfNumber: '1007281920',
    leaveDays: { annual: 15, annualTotal: 21, sick: 10, sickTotal: 10, emergency: 4, emergencyTotal: 4 },
  },
  {
    id: 'NF-0063',
    initials: 'JO',
    color: 'bg-red-500',
    name: 'Joseph Okello',
    phone: '0789 204 337',
    email: 'joseph.o@nilefresh.co.ug',
    position: 'Driver',
    department: 'Logistics',
    branch: 'Entebbe Depot',
    type: 'Contract',
    started: 'Jan 2024',
    status: 'Active',
    salary: '950000',
    paymentFrequency: 'Monthly',
    reportsTo: 'Martin Kato',
    shift: 'Day Shift (8:00 AM - 5:00 PM)',
    clockedIn: '07:40',
    nationalId: 'CM88019284JO3',
    nssfNumber: '1004192049',
    leaveDays: { annual: 9, annualTotal: 15, sick: 5, sickTotal: 10, emergency: 1, emergencyTotal: 4 },
  },
  {
    id: 'NF-0070',
    initials: 'AN',
    color: 'bg-sky-500',
    name: 'Annet Nakato',
    phone: '0752 661 048',
    email: 'annet.n@nilefresh.co.ug',
    position: 'Accounts Assistant',
    department: 'Finance',
    branch: 'Kampala HQ',
    type: 'Permanent',
    started: 'Apr 2024',
    status: 'On leave',
    salary: '1350000',
    paymentFrequency: 'Monthly',
    reportsTo: 'Esther Akello',
    shift: 'Day Shift (8:00 AM - 5:00 PM)',
    clockedIn: '—',
    nationalId: 'CF96048192AN0',
    nssfNumber: '1008291048',
    leaveDays: { annual: 4, annualTotal: 21, sick: 8, sickTotal: 10, emergency: 2, emergencyTotal: 4 },
  },
  {
    id: 'NF-0091',
    initials: 'MW',
    color: 'bg-lime-600',
    name: 'Moses Waiswa',
    phone: '0776 093 582',
    email: 'moses.w@nilefresh.co.ug',
    position: 'Loader',
    department: 'Warehouse',
    branch: 'Mukono Warehouse',
    type: 'Casual',
    started: 'Feb 2025',
    status: 'Active',
    salary: '600000',
    paymentFrequency: 'Monthly',
    reportsTo: 'Grace Atim',
    shift: 'Day Shift (8:00 AM - 5:00 PM)',
    clockedIn: '08:05',
    nationalId: 'CM98028192MW1',
    nssfNumber: '1009482910',
    leaveDays: { annual: 5, annualTotal: 12, sick: 4, sickTotal: 10, emergency: 1, emergencyTotal: 4 },
  },
  {
    id: 'NF-0104',
    initials: 'HN',
    color: 'bg-pink-500',
    name: 'Harriet Nansubuga',
    phone: '0708 377 150',
    email: 'harriet.n@nilefresh.co.ug',
    position: 'Cashier',
    department: 'Sales',
    branch: 'Ntinda Store',
    type: 'Permanent',
    started: 'Jul 2025',
    status: 'Active',
    salary: '850000',
    paymentFrequency: 'Monthly',
    reportsTo: 'David Mugisha',
    shift: 'Day Shift (8:00 AM - 5:00 PM)',
    clockedIn: '07:51',
    nationalId: 'CF97038192HN4',
    nssfNumber: '1008192039',
    leaveDays: { annual: 17, annualTotal: 21, sick: 10, sickTotal: 10, emergency: 3, emergencyTotal: 4 },
  },
  {
    id: 'NF-0131',
    initials: 'FA',
    color: 'bg-amber-500',
    name: 'Fiona Achieng',
    phone: '0787 512 739',
    email: 'fiona.a@nilefresh.co.ug',
    position: 'Sales Associate',
    department: 'Sales',
    branch: 'Kampala HQ',
    type: 'Contract',
    started: 'Aug 2026',
    status: 'Probation',
    salary: '1050000',
    paymentFrequency: 'Monthly',
    reportsTo: 'Ruth Nabirye',
    shift: 'Day Shift (8:00 AM - 5:00 PM)',
    clockedIn: '08:10',
    nationalId: 'CF99019283FA1',
    nssfNumber: '1009849201',
    leaveDays: { annual: 12, annualTotal: 15, sick: 10, sickTotal: 10, emergency: 3, emergencyTotal: 4 },
  },
  {
    id: 'NF-0138',
    initials: 'PL',
    color: 'bg-cyan-600',
    name: 'Paul Lubega',
    phone: '0759 428 061',
    email: 'paul.l@nilefresh.co.ug',
    position: 'Sales Associate',
    department: 'Sales',
    branch: 'Ntinda Store',
    type: 'Contract',
    started: 'Sep 2026',
    status: 'Probation',
    salary: '1050000',
    paymentFrequency: 'Monthly',
    reportsTo: 'David Mugisha',
    shift: 'Day Shift (8:00 AM - 5:00 PM)',
    clockedIn: '07:59',
    nationalId: 'CM00019284PL8',
    nssfNumber: '1009928104',
    leaveDays: { annual: 14, annualTotal: 15, sick: 10, sickTotal: 10, emergency: 4, emergencyTotal: 4 },
  },
]

function getStoredEmployees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES))
      return [...INITIAL_EMPLOYEES]
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_EMPLOYEES]
  } catch {
    return [...INITIAL_EMPLOYEES]
  }
}

function saveEmployees(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to save employees to localStorage', err)
  }
}

function computeInitials(name = '') {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return 'EM'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const employeeService = {
  /**
   * Get all employees, optionally filtered and paginated.
   */
  getAll({ search = '', status = 'All', department = 'All', branch = 'All', type = 'All' } = {}) {
    const all = getStoredEmployees()
    const query = search.trim().toLowerCase()

    const filtered = all.filter((emp) => {
      // Status filter
      if (status !== 'All' && emp.status !== status) return false

      // Department filter
      if (department !== 'All' && emp.department !== department) return false

      // Branch filter
      if (branch !== 'All' && emp.branch !== branch) return false

      // Employment type filter
      if (type !== 'All' && emp.type !== type) return false

      // Search query filter
      if (query) {
        const matchesName = emp.name?.toLowerCase().includes(query)
        const matchesId = emp.id?.toLowerCase().includes(query)
        const matchesPhone = emp.phone?.includes(query)
        const matchesEmail = emp.email?.toLowerCase().includes(query)
        const matchesPos = emp.position?.toLowerCase().includes(query)
        const matchesDept = emp.department?.toLowerCase().includes(query)
        const matchesBranch = emp.branch?.toLowerCase().includes(query)
        if (!matchesName && !matchesId && !matchesPhone && !matchesEmail && !matchesPos && !matchesDept && !matchesBranch) {
          return false
        }
      }

      return true
    })

    return {
      employees: filtered,
      total: filtered.length,
      allCount: all.length,
      countsByStatus: {
        All: all.length,
        Active: all.filter((e) => e.status === 'Active').length,
        Probation: all.filter((e) => e.status === 'Probation').length,
        'On leave': all.filter((e) => e.status === 'On leave').length,
        Exited: all.filter((e) => e.status === 'Exited').length,
      },
    }
  },

  /**
   * Retrieve a single employee by ID.
   */
  getById(id) {
    if (!id) return null
    const all = getStoredEmployees()
    return all.find((emp) => emp.id.toLowerCase() === String(id).toLowerCase()) || null
  },

  /**
   * Create a new employee record.
   */
  create(data) {
    const all = getStoredEmployees()
    const newNum = all.length + 140
    const newId = `NF-0${newNum}`

    const colors = ['bg-blue-500', 'bg-teal-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500', 'bg-indigo-500']
    const color = colors[Math.floor(Math.random() * colors.length)]

    const newEmp = {
      id: newId,
      initials: computeInitials(data.fullName || data.name),
      color,
      name: (data.fullName || data.name || '').trim(),
      phone: data.phone || '',
      email: data.email || `${(data.fullName || 'employee').toLowerCase().replace(/\s+/g, '.')}@nilefresh.co.ug`,
      position: data.jobPosition || data.position || 'Staff',
      department: data.department || 'Sales',
      branch: data.branch || 'Ntinda Store',
      type: data.employmentType || data.type || 'Permanent',
      started: data.startDate || new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      status: 'Active',
      salary: data.salary || '1000000',
      paymentFrequency: data.paymentFrequency || 'Monthly',
      reportsTo: data.reportsTo || 'David Mugisha',
      shift: data.shift || 'Day Shift (8:00 AM - 5:00 PM)',
      clockedIn: '—',
      nationalId: data.nationalId || `CM${Math.floor(Math.random() * 90000000)}UG`,
      nssfNumber: data.nssfNumber || `100${Math.floor(Math.random() * 9000000)}`,
      leaveDays: { annual: 21, annualTotal: 21, sick: 10, sickTotal: 10, emergency: 4, emergencyTotal: 4 },
      documents: data.documents || [],
      createdAt: new Date().toISOString(),
    }

    const updated = [newEmp, ...all]
    saveEmployees(updated)
    return newEmp
  },

  /**
   * Update an existing employee.
   */
  update(id, updates) {
    const all = getStoredEmployees()
    const index = all.findIndex((e) => e.id.toLowerCase() === String(id).toLowerCase())
    if (index === -1) return null

    const current = all[index]
    const updated = {
      ...current,
      ...updates,
      initials: updates.name ? computeInitials(updates.name) : current.initials,
      updatedAt: new Date().toISOString(),
    }

    all[index] = updated
    saveEmployees(all)
    return updated
  },

  /**
   * Update employee status (Active, Probation, On leave, Exited).
   */
  updateStatus(id, newStatus) {
    return this.update(id, { status: newStatus })
  },

  /**
   * Delete or deactivate an employee.
   */
  delete(id) {
    const all = getStoredEmployees()
    const remaining = all.filter((e) => e.id.toLowerCase() !== String(id).toLowerCase())
    saveEmployees(remaining)
    return true
  },

  /**
   * Export all currently stored employees as CSV.
   */
  exportToCsv(employeeList) {
    const list = employeeList || getStoredEmployees()
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Position', 'Department', 'Branch', 'Type', 'Started', 'Status', 'Salary']
    const rows = list.map((e) => [
      e.id,
      `"${e.name || ''}"`,
      `"${e.phone || ''}"`,
      `"${e.email || ''}"`,
      `"${e.position || ''}"`,
      `"${e.department || ''}"`,
      `"${e.branch || ''}"`,
      `"${e.type || ''}"`,
      `"${e.started || ''}"`,
      `"${e.status || ''}"`,
      `"${e.salary || ''}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `attndi_employees_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },

  /**
   * Reset store to initial seed.
   */
  resetToDefaults() {
    saveEmployees(INITIAL_EMPLOYEES)
    return [...INITIAL_EMPLOYEES]
  },
}

// Backward compatibility export matching what earlier components expected
export const employees = INITIAL_EMPLOYEES
