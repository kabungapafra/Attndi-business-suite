import { Link } from 'react-router-dom'

/** 404 Not Found page */
export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', gap: '16px', textAlign: 'center',
      padding: '24px',
    }}>
      <div style={{ fontSize: '80px' }}>🔍</div>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 700 }}>404 – Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        style={{
          marginTop: '8px',
          padding: '10px 24px',
          background: 'var(--color-brand-500)',
          color: 'white',
          borderRadius: 'var(--border-radius-md)',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
