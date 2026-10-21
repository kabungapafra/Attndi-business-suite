import { useState } from 'react'
import { COLUMNS } from './tasksData'
import styles from './TasksPage.module.css'

export default function TasksPage() {
  const [branchFilter, setBranchFilter] = useState('All')
  const [assigneeFilter, setAssigneeFilter] = useState('Anyone')

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.crumb}>Work · Tasks</span>
          <h1 className={styles.title}>What people are working on</h1>
        </div>
        <div className={styles.tools}>
          <label className={styles.filterLabel}>
            Branch
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="All">All</option>
            </select>
          </label>
          <label className={styles.filterLabel}>
            Assignee
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="Anyone">Anyone</option>
            </select>
          </label>
          <button type="button" className={styles.assignBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Assign task
          </button>
        </div>
      </header>

      <div className={styles.statsBar}>
        <span><strong>46</strong> open</span>
        <span><strong className={styles.overdueText}>5</strong> overdue</span>
        <span><strong>12</strong> waiting for review</span>
        <span><strong>88%</strong> done on time this month</span>
      </div>

      <section className={styles.boardGrid}>
        {COLUMNS.map((col) => (
          <div key={col.id} className={styles.columnCard}>
            <div className={styles.colHeader}>
              <h2 className={styles.colTitle}>{col.title}</h2>
              <span className={styles.colCount}>{col.count}</span>
            </div>
            <div className={styles.cardsCol}>
              {col.cards.map((c) => (
                <article key={c.title} className={styles.taskCard}>
                  <div className={styles.cardTags}>
                    <span className={`${styles.prioTag} ${styles[c.priority]}`}>
                      {c.prioLabel}
                    </span>
                    <span className={styles.branchTag}>{c.branch}</span>
                  </div>
                  <span className={styles.cardTitle}>{c.title}</span>
                  {c.note ? <span className={styles.cardNote}>{c.note}</span> : null}
                  <div className={styles.cardFooter}>
                    <span className={styles.assigneeGroup}>
                      <span className={styles.avatar}>{c.who}</span>
                      <span className={styles.checklist}>{c.checklist}</span>
                    </span>
                    <span className={c.late ? styles.dueLate : styles.dueNormal}>
                      {c.due}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

