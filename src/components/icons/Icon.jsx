const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ children, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      {children}
    </svg>
  )
}

const ICONS = {
  overview: () => (
    <Svg>
      <rect x="3" y="3" width="7" height="7" rx="1.4" />
      <rect x="14" y="3" width="7" height="7" rx="1.4" />
      <rect x="3" y="14" width="7" height="7" rx="1.4" />
      <rect x="14" y="14" width="7" height="7" rx="1.4" />
    </Svg>
  ),
  users: () => (
    <Svg>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="3.2" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a3.2 3.2 0 0 1 0 6.24" />
    </Svg>
  ),
  building: () => (
    <Svg>
      <path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
      <path d="M14 10h5a1 1 0 0 1 1 1v10" />
      <path d="M3 21h18" />
      <path d="M8 8h.01M8 12h.01M8 16h.01M11 8h.01M11 12h.01M11 16h.01" />
    </Svg>
  ),
  file: () => (
    <Svg>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </Svg>
  ),
  clock: () => (
    <Svg>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  ),
  calendar: () => (
    <Svg>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" />
    </Svg>
  ),
  schedule: () => (
    <Svg>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" />
      <path d="M12 13.5v3l2 1" />
    </Svg>
  ),
  tasks: () => (
    <Svg>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4.5 6.2l1.2 1.2 2.2-2.4M4.5 12.2l1.2 1.2 2.2-2.4M4.5 18.2l1.2 1.2 2.2-2.4" />
    </Svg>
  ),
  trend: () => (
    <Svg>
      <path d="M3 17l6-6 4 4 8-9" />
      <path d="M15 6h6v6" />
    </Svg>
  ),
  payroll: () => (
    <Svg>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h2" />
    </Svg>
  ),
  wallet: () => (
    <Svg>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M16 13h4v3h-4a1.5 1.5 0 0 1 0-3z" />
      <path d="M3 10h18" />
    </Svg>
  ),
  bell: () => (
    <Svg>
      <path d="M6 9a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </Svg>
  ),
  chart: () => (
    <Svg>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </Svg>
  ),
  list: () => (
    <Svg>
      <path d="M8 7h12M8 12h12M8 17h12" />
      <circle cx="4.5" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="17" r="1" fill="currentColor" stroke="none" />
    </Svg>
  ),
  settings: () => (
    <Svg>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.6M17.5 16l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.6M17.5 8l1.6-1.6" />
    </Svg>
  ),
  search: () => (
    <Svg size={16}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5L20.5 21" />
    </Svg>
  ),
  chevron: () => (
    <Svg size={14}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  ),
  arrow: () => (
    <Svg size={16}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  ),
  menu: () => (
    <Svg>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  ),
  close: () => (
    <Svg>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  ),
  plus: () => (
    <Svg size={16}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  ),
}

export default function Icon({ name, className }) {
  const Cmp = ICONS[name]
  if (!Cmp) return null
  return (
    <span className={className} aria-hidden="true">
      <Cmp />
    </span>
  )
}
