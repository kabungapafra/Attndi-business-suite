import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { NAV_SECTIONS, APP_NAME } from '@utils/constants'
import { useAuth } from '@hooks/useAuth'
import Icon from '@components/icons/Icon'
import styles from './Sidebar.module.css'

export default function Sidebar({ onNavigate }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out of Attndi?')) {
      logout()
      navigate('/login')
    }
  }

  return (
    <aside className={styles.sidebar} aria-label="Main navigation">
      <NavLink to="/dashboard" className={styles.brand} onClick={onNavigate}>
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 4 L25 22 M16 4 L7 22 M11 15h10" />
          <path d="M8 26.5q8 4 16 0" stroke="#F0A04B" />
          <path d="M11.5 29.5q4.5 2 9 0" stroke="#F0A04B" strokeWidth="2" />
        </svg>
        <span className={styles.brandName}>{APP_NAME}</span>
      </NavLink>

      <button type="button" className={styles.company}>
        <span className={styles.companyBadge}>NF</span>
        <span className={styles.companyCopy}>
          <span className={styles.companyName}>Nile Fresh Supplies</span>
          <span className={styles.companyMeta}>All branches · 138 staff</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9FAACB" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <nav className={styles.nav}>
        {NAV_SECTIONS.map(section => (
          <div key={section.id} className={styles.section}>
            {section.label ? <p className={styles.sectionLabel}>{section.label}</p> : null}
            <ul className={styles.navList} role="list">
              {section.items.map(item => {
                const isActive = item.path && location.pathname.startsWith(item.path)
                const content = (
                  <>
                    <Icon name={item.icon} className={styles.navIcon} />
                    <span className={styles.navLabel}>{item.label}</span>
                    {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
                  </>
                )

                return (
                  <li key={item.id}>
                    {item.path ? (
                      <NavLink
                        to={item.path}
                        className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={onNavigate}
                      >
                        {content}
                      </NavLink>
                    ) : (
                      <span className={styles.navLink}>{content}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.user}>
        <span className={styles.userAvatar}>
          {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'PK'}
        </span>
        <span className={styles.userCopy}>
          <span className={styles.userName}>{user?.name || 'Pafra K.'}</span>
          <span className={styles.userRole}>{user?.role ? `${user.role} · Admin` : 'Owner · Admin'}</span>
        </span>
        <button
          type="button"
          aria-label="Sign out"
          title="Sign out"
          onClick={handleSignOut}
          className={styles.signOutBtn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4" />
          </svg>
        </button>
      </div>
    </aside>
  )
}

