/**
 * constants.js
 * App-wide constants, enums, and configuration values.
 * Import these instead of hard-coding magic strings/numbers.
 */

// ── App Info ────────────────────────────────────────────────────────────────
export const APP_NAME    = import.meta.env.VITE_APP_NAME    ?? 'Attndi'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '1.0.0'
export const API_BASE    = import.meta.env.VITE_API_BASE_URL ?? ''

// ── Roles ───────────────────────────────────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN:       'admin',
  HR_MANAGER:  'hr_manager',
  MANAGER:     'manager',
  EMPLOYEE:    'employee',
}

// ── Attendance Status ────────────────────────────────────────────────────────
export const ATTENDANCE_STATUS = {
  PRESENT:    'present',
  ABSENT:     'absent',
  LATE:       'late',
  HALF_DAY:   'half_day',
  ON_LEAVE:   'on_leave',
  HOLIDAY:    'holiday',
  WEEKEND:    'weekend',
}

// ── Leave Types ──────────────────────────────────────────────────────────────
export const LEAVE_TYPES = {
  ANNUAL:     'annual',
  SICK:       'sick',
  MATERNITY:  'maternity',
  PATERNITY:  'paternity',
  EMERGENCY:  'emergency',
  UNPAID:     'unpaid',
}

// ── Leave Request Status ─────────────────────────────────────────────────────
export const LEAVE_STATUS = {
  PENDING:    'pending',
  APPROVED:   'approved',
  REJECTED:   'rejected',
  CANCELLED:  'cancelled',
}

// ── Employment Types ─────────────────────────────────────────────────────────
export const EMPLOYMENT_TYPE = {
  FULL_TIME:  'full_time',
  PART_TIME:  'part_time',
  CONTRACT:   'contract',
  INTERN:     'intern',
}

// ── Employee Status ──────────────────────────────────────────────────────────
export const EMPLOYEE_STATUS = {
  ACTIVE:     'active',
  INACTIVE:   'inactive',
  TERMINATED: 'terminated',
  ON_LEAVE:   'on_leave',
}

// ── Payroll Period ───────────────────────────────────────────────────────────
export const PAYROLL_PERIOD = {
  MONTHLY:    'monthly',
  BI_WEEKLY:  'bi_weekly',
  WEEKLY:     'weekly',
}

// ── Navigation (matches product screenshots) ─────────────────────────────────
export const NAV_SECTIONS = [
  {
    id: 'main',
    items: [
      { id: 'overview', label: 'Overview', path: '/dashboard', icon: 'overview' },
    ],
  },
  {
    id: 'people',
    label: 'PEOPLE',
    items: [
      { id: 'employees', label: 'Employees', path: '/employees', icon: 'users' },
      { id: 'branches', label: 'Branches & departments', path: '/branches', icon: 'building' },
      { id: 'documents', label: 'Documents & contracts', path: '/documents', icon: 'file' },
    ],
  },
  {
    id: 'time',
    label: 'TIME',
    items: [
      { id: 'attendance', label: 'Attendance', path: '/attendance', icon: 'clock' },
      { id: 'schedules', label: 'Schedules & shifts', icon: 'schedule' },
      { id: 'leave', label: 'Leave', path: '/leave', icon: 'calendar', badge: 3 },
    ],
  },
  {
    id: 'work',
    label: 'WORK',
    items: [
      { id: 'tasks', label: 'Tasks', path: '/tasks', icon: 'tasks' },
      { id: 'performance', label: 'Performance', path: '/performance', icon: 'trend' },
    ],
  },
  {
    id: 'money',
    label: 'MONEY',
    items: [
      { id: 'payroll', label: 'Payroll', path: '/payroll', icon: 'payroll' },
      { id: 'expenses', label: 'Expenses', icon: 'wallet', badge: 2 },
    ],
  },
  {
    id: 'company',
    label: 'COMPANY',
    items: [
      { id: 'notifications', label: 'Notifications', icon: 'bell' },
      { id: 'reports', label: 'Reports', path: '/reports', icon: 'chart' },
      { id: 'audit', label: 'Audit trail', icon: 'list' },
      { id: 'settings', label: 'Settings', path: '/settings', icon: 'settings' },
    ],
  },
]

export const NAV_ITEMS = NAV_SECTIONS.flatMap(section => section.items)

// ── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE   = 20
export const PAGE_SIZE_OPTIONS   = [10, 20, 50, 100]

// ── Date Formats ─────────────────────────────────────────────────────────────
export const DATE_FORMAT         = 'YYYY-MM-DD'
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY'
export const TIME_FORMAT         = 'HH:mm'

// ── Storage Keys (keep in sync with context files) ───────────────────────────
export const STORAGE_KEYS = {
  TOKEN: 'abs_token',
  USER:  'abs_user',
  THEME: 'abs_theme',
}
