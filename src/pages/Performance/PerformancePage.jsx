import { Link } from 'react-router-dom'
import { PROGRESS, PEOPLE, WEIGHTS, CONVERSATIONS } from './performanceData'
import styles from './PerformancePage.module.css'

export default function PerformancePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.crumb}>Work · Performance</span>
          <h1 className={styles.title}>Q3 2026 review cycle</h1>
        </div>
        <div className={styles.tools}>
          <button type="button" className={styles.kpiBtn}>Review forms &amp; KPIs</button>
          <button type="button" className={styles.remindBtn}>Remind managers</button>
        </div>
      </header>

      <section className={styles.progressGrid}>
        {PROGRESS.map((p) => (
          <div key={p.label} className={styles.progressCard}>
            <span className={styles.progressLabel}>{p.label}</span>
            <span className={styles.progressValue}>{p.value}</span>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressBar}
                style={{ width: `${p.pct}%`, background: p.color }}
              />
            </div>
            <span className={styles.progressSub}>{p.sub}</span>
          </div>
        ))}
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <span>Employee</span>
            <span>Branch</span>
            <span>Attendance</span>
            <span>Tasks on time</span>
            <span>Manager</span>
            <span>Overall</span>
            <span>Review</span>
          </div>
          <div className={styles.tableBody}>
            {PEOPLE.map((r) => {
              const num = parseFloat(r.overall)
              const isLow = num && num < 3.2
              return (
                <div key={r.name} className={styles.tableRow}>
                  <span className={styles.empCell}>
                    <Link to={`/employees`} className={styles.empName}>{r.name}</Link>
                    <span className={styles.empRole}>{r.role}</span>
                  </span>
                  <span className={styles.branchCell}>{r.branch}</span>
                  <span className={styles.metricCell}>{r.att}</span>
                  <span className={styles.metricCell}>{r.tasks}</span>
                  <span className={styles.metricCell}>{r.mgr}</span>
                  <span className={isLow ? styles.overallLow : styles.overallNormal}>
                    {r.overall}
                  </span>
                  <span className={`${styles.statusPill} ${styles[r.tone]}`}>
                    {r.status}
                  </span>
                </div>
              )
            })}
          </div>
          <p className={styles.footnote}>
            Attendance and task scores are calculated automatically from clock-ins and completed tasks. Managers add their rating.
          </p>
        </div>

        <div className={styles.sideStack}>
          <div className={styles.scoreWeightCard}>
            <h2 className={styles.sideTitleLight}>How the score is built</h2>
            <div className={styles.weightsList}>
              {WEIGHTS.map((w) => (
                <div key={w.label} className={styles.weightItem}>
                  <div className={styles.weightRow}>
                    <span>{w.label}</span>
                    <span className={styles.weightPct}>{w.pct}</span>
                  </div>
                  <div className={styles.weightTrack}>
                    <div className={styles.weightBar} style={{ width: `${w.barPct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.conversationCard}>
            <h2 className={styles.sideTitleDark}>Needs a conversation</h2>
            <div className={styles.convosList}>
              {CONVERSATIONS.map((s) => (
                <div key={s.name} className={styles.convoItem}>
                  <Link to={`/employees`} className={styles.convoName}>{s.name}</Link>
                  <span className={styles.convoWhy}>{s.why}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

