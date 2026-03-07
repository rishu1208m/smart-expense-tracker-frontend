import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { clearAuth } from '../api/storage'

const NAV = [
  { icon:'📊', label:'Dashboard',  path:'/dashboard' },
  { icon:'📋', label:'Expenses',   path:'/expenses'  },
  { icon:'📈', label:'Analytics',  path:'/analytics' },
  { icon:'🎯', label:'Goals',      path:'/goals'     },
  { icon:'⚙️', label:'Settings',   path:'/settings'  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <aside style={{
      width:220, background:'#fff', borderRight:'1px solid #e4e9f7',
      display:'flex', flexDirection:'column', padding:'24px 16px',
      fontFamily:"'Plus Jakarta Sans',sans-serif",
      position:'sticky', top:0, height:'100vh',
    }}>
      {/* Brand */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:36, paddingLeft:8 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#1a6bff,#00d4ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, boxShadow:'0 4px 12px rgba(26,107,255,.4)' }}>💎</div>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:'#0f1c3f', lineHeight:1.2 }}>ExpenseIQ</div>
          <div style={{ fontSize:11, color:'#8892b0' }}>Smart Tracker</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:4 }}>
        {NAV.map(item => {
          const active = location.pathname === item.path
          return (
            <button key={item.path} onClick={()=>navigate(item.path)} style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'11px 14px', borderRadius:12, border:'none',
              background: active ? '#1a6bff18' : 'transparent',
              color:      active ? '#1a6bff'   : '#4a5578',
              fontSize:14, fontWeight: active ? 700 : 500,
              cursor:'pointer', textAlign:'left', width:'100%',
              fontFamily:"'Plus Jakarta Sans',sans-serif",
              borderLeft: `3px solid ${active ? '#1a6bff' : 'transparent'}`,
              transition:'all .15s',
            }}
              onMouseEnter={e=>{ if(!active) e.currentTarget.style.background='#f8faff' }}
              onMouseLeave={e=>{ if(!active) e.currentTarget.style.background='transparent' }}
            >
              <span style={{ fontSize:18 }}>{item.icon}</span>
              {item.label}
              {active && <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'#1a6bff' }}/>}
            </button>
          )
        })}
      </nav>

      {/* Sign Out */}
      <button onClick={handleSignOut} style={{
        display:'flex', alignItems:'center', gap:12,
        padding:'11px 14px', borderRadius:12, border:'none',
        background:'transparent', color:'#ef4444',
        fontSize:14, fontWeight:500, cursor:'pointer',
        fontFamily:"'Plus Jakarta Sans',sans-serif", width:'100%', textAlign:'left',
        transition:'all .15s',
      }}
        onMouseEnter={e=>e.currentTarget.style.background='#fef2f2'}
        onMouseLeave={e=>e.currentTarget.style.background='transparent'}
      >
        <span style={{ fontSize:18 }}>🚪</span> Sign Out
      </button>
    </aside>
  )
}