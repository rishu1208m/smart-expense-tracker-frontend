import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { getUser, saveAuth, getToken } from '../api/storage'

const CURRENCIES = ['₹ INR','$ USD','€ EUR','£ GBP','¥ JPY','$ AUD','$ CAD']

export default function Profile() {
  const user  = getUser()
  const token = getToken()

  const [firstName,     setFirstName]     = useState(user?.name?.split(' ')[0] || '')
  const [lastName,      setLastName]      = useState(user?.name?.split(' ').slice(1).join(' ') || '')
  const [email]                           = useState(user?.email || '')
  const [currency,      setCurrency]      = useState(user?.currency || '₹ INR')
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget || '')
  const [saving,        setSaving]        = useState(false)
  const [saved,         setSaved]         = useState(false)
  const [focused,       setFocused]       = useState('')

  const inp = (f) => ({
    width:'100%', padding:'13px 16px',
    background: focused===f ? '#fff' : '#f8faff',
    border:`1.5px solid ${focused===f ? '#1a6bff' : '#e4e9f7'}`,
    borderRadius:12, fontSize:14, color:'#0f1c3f', outline:'none',
    fontFamily:"'Plus Jakarta Sans',sans-serif", boxSizing:'border-box',
    boxShadow: focused===f ? '0 0 0 3px rgba(26,107,255,.1)' : 'none',
    transition:'all .2s',
  })

  const handleSave = (e) => {
    e.preventDefault()
    setSaving(true)
    const updatedUser = { ...user, name:`${firstName} ${lastName}`.trim(), currency, monthlyBudget:Number(monthlyBudget) }
    saveAuth(token, updatedUser)
    setTimeout(() => { setSaving(false); setSaved(true) }, 800)
    setTimeout(() => setSaved(false), 3000)
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U'

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f5f7ff', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <Sidebar />
      <main style={{ flex:1, padding:'40px 36px', maxWidth:800 }}>
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#0f1c3f', letterSpacing:'-.02em', marginBottom:4 }}>Profile & Settings</h1>
          <p style={{ fontSize:14, color:'#8892b0' }}>Manage your account and preferences</p>
        </div>

        {/* Profile Card */}
        <div style={{ background:'#fff', borderRadius:20, border:'1px solid #e4e9f7', overflow:'hidden', boxShadow:'0 2px 8px rgba(15,28,63,.05)', marginBottom:20 }}>
          <div style={{ height:100, background:'linear-gradient(135deg,#060e22 0%,#1a6bff 100%)' }}/>
          <div style={{ padding:'0 28px 24px', marginTop:-40 }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#1a6bff,#00d4ff)', border:'4px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:800, color:'#fff', boxShadow:'0 4px 16px rgba(26,107,255,.4)', marginBottom:12 }}>{initials}</div>
            <div style={{ fontSize:20, fontWeight:800, color:'#0f1c3f' }}>{firstName} {lastName}</div>
            <div style={{ fontSize:14, color:'#8892b0' }}>{email}</div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          {/* Personal Info */}
          <div style={{ background:'#fff', borderRadius:20, border:'1px solid #e4e9f7', padding:'24px 28px', marginBottom:16, boxShadow:'0 2px 8px rgba(15,28,63,.05)' }}>
            <h3 style={{ fontSize:15, fontWeight:700, color:'#0f1c3f', margin:'0 0 20px', paddingBottom:12, borderBottom:'1px solid #f0f4ff' }}>👤 Personal Information</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>First Name</label>
                <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} onFocus={()=>setFocused('fn')} onBlur={()=>setFocused('')} style={inp('fn')} placeholder="Rahul"/>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Last Name</label>
                <input type="text" value={lastName} onChange={e=>setLastName(e.target.value)} onFocus={()=>setFocused('ln')} onBlur={()=>setFocused('')} style={inp('ln')} placeholder="Sharma"/>
              </div>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Email Address</label>
              <input type="email" value={email} disabled style={{...inp('em'), background:'#f8faff', color:'#8892b0', cursor:'not-allowed'}}/>
              <div style={{ fontSize:11, color:'#8892b0', marginTop:6 }}>📧 Email cannot be changed</div>
            </div>
          </div>

          {/* Financial Settings */}
          <div style={{ background:'#fff', borderRadius:20, border:'1px solid #e4e9f7', padding:'24px 28px', marginBottom:16, boxShadow:'0 2px 8px rgba(15,28,63,.05)' }}>
            <h3 style={{ fontSize:15, fontWeight:700, color:'#0f1c3f', margin:'0 0 20px', paddingBottom:12, borderBottom:'1px solid #f0f4ff' }}>💰 Financial Preferences</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Currency</label>
                <select value={currency} onChange={e=>setCurrency(e.target.value)} onFocus={()=>setFocused('cur')} onBlur={()=>setFocused('')} style={{...inp('cur'), cursor:'pointer'}}>
                  {CURRENCIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Monthly Budget</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#8892b0', pointerEvents:'none' }}>₹</span>
                  <input type="number" value={monthlyBudget} onChange={e=>setMonthlyBudget(e.target.value)} onFocus={()=>setFocused('mb')} onBlur={()=>setFocused('')} style={{...inp('mb'), paddingLeft:30}} placeholder="25000"/>
                </div>
                <div style={{ fontSize:11, color:'#8892b0', marginTop:6 }}>💡 Used to calculate budget remaining</div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} style={{ width:'100%', padding:14, borderRadius:14, border:'none', background: saved ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#1a6bff,#0d4fd9)', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:'0 4px 16px rgba(26,107,255,.3)', transition:'all .3s' }}>
            {saving ? '⏳ Saving...' : saved ? '✅ Saved!' : 'Save Changes'}
          </button>
        </form>

        {/* Danger Zone */}
        <div style={{ background:'#fff', borderRadius:20, border:'1px solid #fecaca', padding:'24px 28px', marginTop:16 }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:'#ef4444', margin:'0 0 8px' }}>⚠️ Danger Zone</h3>
          <p style={{ fontSize:13, color:'#8892b0', marginBottom:16 }}>Permanently delete your account and all data.</p>
          <button onClick={()=>alert('Contact support to delete your account.')} style={{ padding:'10px 20px', borderRadius:10, border:'1.5px solid #fecaca', background:'#fef2f2', color:'#ef4444', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            Delete Account
          </button>
        </div>
      </main>
    </div>
  )
}