import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
  { icon: '📈', label: 'Analytics',  path: '/analytics' },
  { icon: '📄', label: 'Expenses',   path: '/expenses'  },
  { icon: '📤', label: 'Approvals',  path: '/approvals' },
  { icon: '⚙️', label: 'Settings',   path: '/settings'  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#fff',
      borderRight: '1px solid #e4e9f7', display: 'flex',
      flexDirection: 'column', padding: '24px 12px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, padding: '0 8px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, fontSize: 18,
          background: 'linear-gradient(135deg,#1a6bff,#00d4ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>💎</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0f1c3f' }}>ExpenseIQ</div>
          <div style={{ fontSize: 10, color: '#8892b0' }}>Smart Tracker</div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ icon, label, path }) => {
          const active = pathname === path
          return (
            <button key={path} onClick={() => navigate(path)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, border: 'none',
              background: active ? '#eff5ff' : 'transparent',
              color: active ? '#1a6bff' : '#4a5578',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textAlign: 'left', width: '100%',
            }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              {label}
              {active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#1a6bff' }}/>}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <button onClick={() => { localStorage.removeItem('isLoggedIn'); navigate('/login') }} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 10, border: 'none',
        background: 'transparent', color: '#ef4444',
        fontSize: 13, fontWeight: 600, cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif", width: '100%',
      }}>
        🚪 Sign Out
      </button>
    </aside>
  )
}