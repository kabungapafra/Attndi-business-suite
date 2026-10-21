import { Link } from 'react-router-dom'
import { CLOCK_INS, APPROVALS, BRANCHES } from './overviewData'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.date}>Monday, 28 September 2026</span>
          <h1 className={styles.title}>Good morning, Pafra</h1>
        </div>
        <div className={styles.tools}>
          <label className={styles.search}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A6174" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M21 21l-5-5" />
            </svg>
            <span className={styles.srOnly}>Search</span>
            <input type="search" placeholder="Search people, tasks, payslips…" />
          </label>
          <button type="button" className={styles.branchSelect}>
            All branches
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <Link to="/notifications" aria-label="Notifications" className={styles.bellBtn}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#141B2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0" />
            </svg>
            <span className={styles.bellDot} />
          </Link>
          <Link to="/payroll" className={styles.payrollAction}>
            Review payroll
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </header>

      <section aria-label="Today at a glance" className={styles.kpis}>
        <div className={styles.kpiDark}>
          <span className={styles.kpiDarkLabel}>Present now</span>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiDarkNum}>112</span>
            <span className={styles.kpiDarkSub}>of 138 scheduled</span>
          </div>
          <div className={styles.darkTrack}>
            <div className={styles.darkBar} style={{ width: '81%' }} />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiCardLabel}>Late today</span>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiLateNum}>9</span>
            <span className={styles.kpiCardSub}>avg 18 min</span>
          </div>
          <span className={styles.kpiCardFoot}>Mukono Warehouse has 5 of them</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiCardLabel}>Absent · On leave</span>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiNum}>10</span>
            <span className={styles.kpiCardSub}>·</span>
            <span className={styles.kpiLeaveNum}>7</span>
          </div>
          <span className={styles.kpiCardFoot}>4 absences not yet explained</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiCardLabel}>September payroll · due Wed</span>
          <div className={styles.kpiValueRow}>
            <span className={styles.currencyPrefix}>UGX</span>
            <span className={styles.kpiNum}>48.26M</span>
          </div>
          <span className={styles.kpiPayrollFoot}>Draft · 3 exceptions to resolve</span>
        </div>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Live clock-ins</h2>
            <Link to="/attendance" className={styles.linkAction}>Open attendance board</Link>
          </div>
          <div className={styles.tableHeader}>
            <span>Time</span>
            <span>Employee</span>
            <span>Branch</span>
            <span>Method</span>
            <span>Status</span>
          </div>
          <div className={styles.feedList}>
            {CLOCK_INS.map((row) => (
              <div key={`${row.time}-${row.name}`} className={styles.tableRow}>
                <span className={styles.rowTime}>{row.time}</span>
                <span className={styles.rowEmployee}>
                  <span className={styles.avatar}>{row.initials}</span>
                  <span className={styles.empMeta}>
                    <span className={styles.empName}>{row.name}</span>
                    <span className={styles.empDept}>{row.role}</span>
                  </span>
                </span>
                <span className={styles.rowBranch}>{row.branch}</span>
                <span className={styles.rowMethod}>{row.method}</span>
                <span className={row.pillType === 'late' ? styles.pillLate : styles.pillOk}>
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sideStack}>
          <div className={styles.sideCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Needs your approval</h2>
              <Link to="/leave" className={styles.linkAction}>6 pending · view all</Link>
            </div>
            <div className={styles.approvalsList}>
              {APPROVALS.map((ap) => (
                <div key={ap.name} className={styles.approvalItem}>
                  <span className={styles.approvalMeta}>
                    <span className={styles.approvalWho}>{ap.name}</span>
                    <span className={styles.approvalWhat}>{ap.detail}</span>
                  </span>
                  <button type="button" className={styles.declineBtn}>Decline</button>
                  <button type="button" className={styles.approveBtn}>Approve</button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.branchCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Attendance by branch</h2>
              <Link to="/reports" className={styles.linkAction}>Reports</Link>
            </div>
            <div className={styles.branchesList}>
              {BRANCHES.map((b) => {
                const onTimePct = (((b.present - b.lateCount) / b.total) * 100).toFixed(1)
                const latePct = ((b.lateCount / b.total) * 100).toFixed(1)
                return (
                  <div key={b.name} className={styles.branchItem}>
                    <div className={styles.branchRow}>
                      <span className={styles.branchName}>{b.name}</span>
                      <span className={styles.branchCounts}>{b.present} / {b.total}</span>
                    </div>
                    <div className={styles.branchTrack}>
                      <div className={styles.barOnTime} style={{ width: `${onTimePct}%` }} />
                      <div className={styles.barLate} style={{ width: `${latePct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={styles.branchLegend}>
              <span className={styles.legendItem}>
                <span className={styles.legendSquareBlue} />
                On time
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendSquareOrange} />
                Late
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

