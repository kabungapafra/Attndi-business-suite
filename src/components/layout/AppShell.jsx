import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Icon from '@components/icons/Icon'
import styles from './AppShell.module.css'

export default function AppShell() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className={styles.shell}>
      {navOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <div className={`${styles.sidebarWrap} ${navOpen ? styles.sidebarOpen : ''}`}>
        <Sidebar onNavigate={() => setNavOpen(false)} />
      </div>

      <div className={styles.main}>
        <div className={styles.mobileBar}>
          <button
            type="button"
            className={styles.menuBtn}
            aria-label="Open navigation"
            onClick={() => setNavOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <span className={styles.mobileBrand}>Attndi</span>
        </div>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
