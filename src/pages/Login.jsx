import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../api/auth'
import { saveAuth } from '../api/storage'

/* ─────────────────────────────────────────
   STYLES  (pure inline — no Tailwind needed)
───────────────────────────────────────── */
const S = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" },

  /* LEFT */
  left: {
    flex: 1, position: 'relative', display: 'flex', flexDirection: 'column',
    justifyContent: 'center', padding: '60px 64px', overflow: 'hidden',
    background: 'linear-gradient(145deg,#060e22 0%,#0b1a45 40%,#0a2d6a 70%,#071f4e 100%)',
  },
  mesh: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: `
      radial-gradient(ellipse 80% 60% at 5% 15%,  rgba(26,107,255,.35), transparent 55%),
      radial-gradient(ellipse 60% 80% at 90% 70%,  rgba(0,212,255,.22),  transparent 55%),
      radial-gradient(ellipse 50% 50% at 50% 100%, rgba(0,201,167,.18),  transparent 60%)
    `,
  },
  dots: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'radial-gradient(rgba(255,255,255,.12) 1px,transparent 1px)',
    backgroundSize: '28px 28px',
    WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%,black 20%,transparent 100%)',
  },
  lContent: { position: 'relative', zIndex: 2 },

  brand:     { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 44 },
  brandIcon: {
    width: 46, height: 46, borderRadius: 13, fontSize: 22, flexShrink: 0,
    background: 'linear-gradient(135deg,#1a6bff,#00d4ff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(26,107,255,.55)',
  },
  brandName: { fontWeight: 700, fontSize: 20, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 },
  brandSub:  { fontSize: 11, color: 'rgba(255,255,255,.4)' },

  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 14px', borderRadius: 100, marginBottom: 20,
    background: 'rgba(0,212,255,.1)', border: '1px solid rgba(0,212,255,.3)',
    fontSize: 11, fontWeight: 600, color: '#00d4ff',
    letterSpacing: '0.08em', textTransform: 'uppercase',
  },
  dot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#00d4ff', boxShadow: '0 0 8px #00d4ff',
    animation: 'blink 1.5s infinite',
  },

  h1:   { fontSize: 48, fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.03em', color: '#fff', marginBottom: 18 },
  grad: { background: 'linear-gradient(90deg,#63b3ed,#00d4ff,#00e8c9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  desc: { fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.5)', lineHeight: 1.75, maxWidth: 440, marginBottom: 32 },

  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 },
  chip:  { padding: '7px 13px', borderRadius: 10, fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.72)', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.11)' },

  dashCard: {
    background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.11)',
    borderRadius: 20, padding: '20px 22px', backdropFilter: 'blur(20px)',
    maxWidth: 460, marginBottom: 28,
  },
  dcHead:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  dcTitle:  { fontSize: 12, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 },
  dcChips:  { display: 'flex', gap: 5 },
  dcChip:   { padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(26,107,255,.35)', color: 'rgba(100,160,255,.85)', background: 'rgba(26,107,255,.15)' },
  dcChipOn: { background: 'rgba(26,107,255,.55)', color: '#fff', border: '1px solid rgba(26,107,255,.6)' },
  dcStats:  { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 },
  dcStat:   { background: 'rgba(255,255,255,.05)', borderRadius: 10, padding: '10px 12px' },
  dcVal:    { fontWeight: 700, fontSize: 17, color: '#fff' },
  dcLbl:    { fontSize: 10, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 },
  dcUp:     { fontSize: 10, fontWeight: 600, color: '#00c9a7', marginTop: 3 },
  dcDn:     { fontSize: 10, fontWeight: 600, color: '#ff6b6b', marginTop: 3 },
  bars:     { display: 'flex', alignItems: 'flex-end', gap: 5, height: 44 },

  proof:       { display: 'flex', alignItems: 'center', gap: 14 },
  avRow:       { display: 'flex' },
  av:          { width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' },
  proofTxt:    { fontSize: 12, color: 'rgba(255,255,255,.45)' },
  proofStrong: { color: 'rgba(255,255,255,.78)', fontWeight: 600 },
  stars:       { color: '#ffb347', fontSize: 12, letterSpacing: 1 },

  /* RIGHT */
  right: {
    width: 480, background: '#f5f7ff', position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '32px 44px', borderLeft: '1px solid #e4e9f7', overflowY: 'auto',
  },
  rightLine: {
    position: 'absolute', top: 0, left: 0, bottom: 0, width: 1,
    background: 'linear-gradient(180deg,transparent,#1a6bff 30%,#00d4ff 70%,transparent)',
    opacity: 0.4,
  },
  box:   { width: '100%', maxWidth: 370 },
  title: { fontSize: 26, fontWeight: 800, color: '#0f1c3f', letterSpacing: '-0.03em', marginBottom: 5 },
  sub:   { fontSize: 14, color: '#8892b0', marginBottom: 26 },

  tabs:  { display: 'flex', background: '#e9edf8', borderRadius: 13, padding: 4, marginBottom: 24 },
  tab:   { flex: 1, padding: '9px 0', border: 'none', background: 'transparent', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#8892b0', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" },
  tabOn: { background: '#fff', color: '#0f1c3f', boxShadow: '0 2px 8px rgba(15,28,63,.1)' },

  field:   { marginBottom: 16 },
  lbl:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 600, color: '#4a5578', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 },
  lblLink: { color: '#1a6bff', textDecoration: 'none', fontWeight: 500, fontSize: 12, textTransform: 'none', letterSpacing: 0 },
  iw:      { position: 'relative' },
  ii:      { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' },
  input:   { width: '100%', padding: '13px 16px 13px 40px', background: '#fff', border: '1.5px solid #e4e9f7', borderRadius: 12, fontSize: 14, color: '#0f1c3f', outline: 'none', fontFamily: "'Plus Jakarta Sans',sans-serif", boxSizing: 'border-box' },
  inputF:  { borderColor: '#1a6bff', boxShadow: '0 0 0 3px rgba(26,107,255,.1)' },
  eye:     { position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: '#8892b0', padding: 0 },

  strRow: { display: 'flex', gap: 4, marginTop: 8 },
  seg:    { flex: 1, height: 3, borderRadius: 3, background: '#e4e9f7', transition: 'background .3s' },
  strLbl: { fontSize: 11, marginTop: 5 },

  opts:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, marginTop: 4 },
  chkLbl: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4a5578', cursor: 'pointer' },
  ssoLnk: { fontSize: 13, color: '#1a6bff', textDecoration: 'none', fontWeight: 500 },

  btn: {
    width: '100%', padding: 14, background: 'linear-gradient(135deg,#1a6bff,#0d4fd9)',
    border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, color: '#fff',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginBottom: 18, boxShadow: '0 6px 24px rgba(26,107,255,.35)',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
  },

  /* ── Error box ── */
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: 10, padding: '10px 14px',
    fontSize: 13, color: '#ef4444', marginBottom: 14,
    display: 'flex', alignItems: 'center', gap: 8,
  },

  div:     { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 },
  divLine: { flex: 1, height: 1, background: '#e4e9f7' },
  divTxt:  { fontSize: 12, color: '#8892b0', letterSpacing: '0.05em', whiteSpace: 'nowrap' },

  socials:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 },
  socialBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 11, background: '#fff', border: '1.5px solid #e4e9f7', borderRadius: 11, fontSize: 13, fontWeight: 600, color: '#0f1c3f', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" },

  footer:    { textAlign: 'center', fontSize: 13, color: '#8892b0', marginBottom: 18 },
  footerLnk: { color: '#1a6bff', textDecoration: 'none', fontWeight: 600 },

  trust:     { display: 'flex', justifyContent: 'center', gap: 16, paddingTop: 16, borderTop: '1px solid #e4e9f7' },
  trustItem: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#8892b0', fontWeight: 500 },

  nameGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  select: {
    width: '100%', padding: '13px 12px', background: '#fff',
    border: '1.5px solid #e4e9f7', borderRadius: 12, fontSize: 13,
    color: '#0f1c3f', outline: 'none', cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans',sans-serif", boxSizing: 'border-box',
  },
  currRow: { display: 'grid', gridTemplateColumns: '110px 1fr', gap: 10 },
  hint:    { fontSize: 11, color: '#8892b0', marginTop: 6 },
}

/* ─── Constants ─── */
const FEATURES = [
  'Track Daily Expenses', 'Budget Planning', 'Spending Insights',
  'Bill Reminders', 'Category Analysis', 'Savings Goals',
  'Monthly Reports', 'Receipt Scanner',
]
const BARS = [28,42,33,58,48,68,88,72,84,94,62,86]
const AVATARS = [
  { l:'A', bg:'linear-gradient(135deg,#1a6bff,#00d4ff)' },
  { l:'B', bg:'linear-gradient(135deg,#00c9a7,#0d9e82)' },
  { l:'C', bg:'linear-gradient(135deg,#ffb347,#e8830d)' },
  { l:'+', bg:'linear-gradient(135deg,#ff6b9d,#c0297a)' },
]
const STR_COLS = ['','#ff6b6b','#ffb347','#ecc94b','#00c9a7']
const STR_LBLS = ['','Weak','Fair','Good','Strong 💪']
const CURRENCIES = ['₹ INR','$ USD','€ EUR','£ GBP','¥ JPY','$ AUD','$ CAD']

export default function Login() {
  const navigate = useNavigate()

  /* ── shared state ── */
  const [tab,        setTab]        = useState('login')
  const [focused,    setFocused]    = useState('')
  const [showPwd,    setShowPwd]    = useState(false)
  const [strength,   setStrength]   = useState(0)
  const [loading,    setLoading]    = useState(false)
  const [activeChip, setActiveChip] = useState('M')
  const [error,      setError]      = useState('')   // ← NEW: shows backend errors

  /* ── login fields ── */
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  /* ── signup fields — ALL PERSONAL, no company ── */
  const [firstName,     setFirstName]     = useState('')
  const [lastName,      setLastName]      = useState('')
  const [signupEmail,   setSignupEmail]   = useState('')
  const [phone,         setPhone]         = useState('')
  const [currency,      setCurrency]      = useState('₹ INR')
  const [monthlyBudget, setMonthlyBudget] = useState('')
  const [signupPwd,     setSignupPwd]     = useState('')
  const [confirmPwd,    setConfirmPwd]    = useState('')
  const [showCPwd,      setShowCPwd]      = useState(false)
  const [agreed,        setAgreed]        = useState(false)

  /* ── helpers ── */
  const calcStr = (v) => {
    const c = [v.length>=6, /[A-Z]/.test(v), /[0-9]/.test(v), /[^A-Za-z0-9]/.test(v)]
    setStrength(Math.min(4, c.filter(Boolean).length + (v.length>=10 ? 1 : 0)))
  }
  const inp = (f) => ({ ...S.input,  ...(focused===f ? S.inputF : {}) })
  const sel = (f) => ({ ...S.select, ...(focused===f ? S.inputF : {}) })

  /* ── LOGIN — connected to Spring Boot /api/auth/login ── */
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await loginUser(email, password)
      // Spring Boot returns: { token, email, name }
      saveAuth(data.token, { email: data.email, name: data.name })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── SIGNUP — connected to Spring Boot /api/auth/register ── */
  const handleSignup = async (e) => {
    e.preventDefault()
    if (signupPwd !== confirmPwd) { setError('Passwords do not match.'); return }
    if (!agreed) { setError('Please agree to Terms & Privacy Policy.'); return }
    setLoading(true)
    setError('')
    try {
      const data = await registerUser({
        firstName,
        lastName,
        email:         signupEmail,
        phone,
        currency,
        monthlyBudget: Number(monthlyBudget),
        password:      signupPwd,
      })
      // Spring Boot returns: { token, email, name }
      saveAuth(data.token, { email: data.email, name: data.name })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={S.page}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes flt0  { 0%,100%{transform:translateY(0) rotate(0deg)}   50%{transform:translateY(-18px) rotate(5deg)} }
        @keyframes flt1  { 0%,100%{transform:translateY(0)}                 50%{transform:translateY(15px)} }
        @keyframes flt2  { 0%,100%{transform:translateY(0) rotate(25deg)}  50%{transform:translateY(-12px) rotate(38deg)} }
        select option { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* ══════════ LEFT PANEL ══════════ */}
      <div style={S.left}>
        <div style={S.mesh}/>
        <div style={S.dots}/>

        {/* Floating shapes */}
        {[
          {w:340,h:340,top:-120,right:-100,br:'50%',                        an:'flt0',dur:11},
          {w:220,h:220,bottom:60,left:-80, br:'30% 70% 70% 30%/30% 30% 70% 70%',an:'flt1',dur:13},
          {w:120,h:120,top:'42%',right:'15%',br:18,                         an:'flt2',dur:8},
          {w:70, h:70, top:'18%',left:'22%',br:'50%',                       an:'flt0',dur:7},
          {w:55, h:55, bottom:'28%',right:'22%',br:10,                      an:'flt1',dur:9},
        ].map((s,i)=>(
          <div key={i} style={{
            position:'absolute', width:s.w, height:s.h,
            top:s.top, bottom:s.bottom, left:s.left, right:s.right,
            borderRadius:s.br,
            background:'linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.02))',
            border:'1px solid rgba(255,255,255,.09)',
            animation:`${s.an} ${s.dur}s ease-in-out infinite`,
            pointerEvents:'none',
          }}/>
        ))}

        <div style={S.lContent}>
          {/* Brand */}
          <div style={S.brand}>
            <div style={S.brandIcon}>💎</div>
            <div>
              <div style={S.brandName}>ExpenseIQ</div>
              <div style={S.brandSub}>Personal Expense Tracker</div>
            </div>
          </div>

          {/* Live badge */}
          <div style={S.badge}>
            <span style={S.dot}/> Live tracking enabled
          </div>

          {/* Hero */}
          <h1 style={S.h1}>
            Track every rupee,<br/>
            <span style={S.grad}>save more</span><br/>
            every month
          </h1>
          <p style={S.desc}>
            Your personal money manager — track daily expenses, set budgets,
            get AI-powered insights and finally take control of your finances.
          </p>

          {/* Feature chips */}
          <div style={S.chips}>
            {FEATURES.map(f=><div key={f} style={S.chip}>{f}</div>)}
          </div>

          {/* Dashboard preview card */}
          <div style={S.dashCard}>
            <div style={S.dcHead}>
              <span style={S.dcTitle}>My Spending</span>
              <div style={S.dcChips}>
                {['W','M','Y'].map(c=>(
                  <span key={c} onClick={()=>setActiveChip(c)}
                    style={{...S.dcChip,...(activeChip===c?S.dcChipOn:{})}}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div style={S.dcStats}>
              {[
                {v:'₹18,420',l:'Spent',    c:'8.2%', up:false},
                {v:'₹6,580', l:'Remaining',c:'saved', up:true},
                {v:'34',     l:'Expenses', c:'logged',up:true},
              ].map(s=>(
                <div key={s.l} style={S.dcStat}>
                  <div style={S.dcVal}>{s.v}</div>
                  <div style={S.dcLbl}>{s.l}</div>
                  <div style={s.up?S.dcUp:S.dcDn}>{s.up?'▲':'▼'} {s.c}</div>
                </div>
              ))}
            </div>
            <div style={S.bars}>
              {BARS.map((h,i)=>(
                <div key={i} style={{
                  flex:1, height:`${h}%`, borderRadius:'4px 4px 0 0',
                  background: i===BARS.length-1
                    ? 'linear-gradient(180deg,#00d4ff,#1a6bff)'
                    : 'rgba(26,107,255,.32)',
                }}/>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div style={S.proof}>
            <div style={S.avRow}>
              {AVATARS.map((a,i)=>(
                <div key={i} style={{...S.av,background:a.bg,marginLeft:i>0?-8:0}}>
                  {a.l}
                </div>
              ))}
            </div>
            <div style={S.proofTxt}>
              <div style={S.stars}>★★★★★</div>
              <span><span style={S.proofStrong}>50k+ users</span> saving more every month</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT PANEL ══════════ */}
      <div style={S.right}>
        <div style={S.rightLine}/>
        <div style={S.box}>

          <div style={S.title}>
            {tab==='login' ? 'Welcome back 👋' : 'Create your account 🎉'}
          </div>
          <div style={S.sub}>
            {tab==='login'
              ? 'Sign in to your ExpenseIQ account'
              : 'Start tracking your personal expenses for free'}
          </div>

          {/* Tabs */}
          <div style={S.tabs}>
            {['login','signup'].map(t=>(
              <button key={t}
                onClick={()=>{ setTab(t); setError(''); setLoading(false) }}
                style={{...S.tab,...(tab===t?S.tabOn:{})}}>
                {t==='login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* ════ LOGIN FORM ════ */}
          {tab==='login' && (
            <form onSubmit={handleLogin}>

              {/* Email */}
              <div style={S.field}>
                <div style={S.lbl}>Email Address</div>
                <div style={S.iw}>
                  <span style={S.ii}>📧</span>
                  <input type="email" value={email} placeholder="you@gmail.com"
                    onChange={e=>setEmail(e.target.value)}
                    onFocus={()=>setFocused('em')} onBlur={()=>setFocused('')}
                    style={inp('em')} required/>
                </div>
              </div>

              {/* Password */}
              <div style={S.field}>
                <div style={S.lbl}>
                  Password
                  <a href="#" style={S.lblLink}>Forgot password?</a>
                </div>
                <div style={S.iw}>
                  <span style={S.ii}>🔑</span>
                  <input type={showPwd?'text':'password'} value={password}
                    placeholder="Enter your password"
                    onChange={e=>{ setPassword(e.target.value); calcStr(e.target.value) }}
                    onFocus={()=>setFocused('pw')} onBlur={()=>setFocused('')}
                    style={{...inp('pw'),paddingRight:40}} required/>
                  <button type="button" onClick={()=>setShowPwd(!showPwd)} style={S.eye}>
                    {showPwd?'🙈':'👁'}
                  </button>
                </div>
                {password && (
                  <>
                    <div style={S.strRow}>
                      {[1,2,3,4].map(i=>(
                        <div key={i} style={{...S.seg,background:i<=strength?STR_COLS[strength]:'#e4e9f7'}}/>
                      ))}
                    </div>
                    <div style={{...S.strLbl,color:STR_COLS[strength]}}>{STR_LBLS[strength]}</div>
                  </>
                )}
              </div>

              {/* Options */}
              <div style={S.opts}>
                <label style={S.chkLbl}>
                  <input type="checkbox" style={{accentColor:'#1a6bff',width:15,height:15}}/>
                  Keep me signed in
                </label>
              </div>

              {/* ── Error message from backend ── */}
              {error && (
                <div style={S.errorBox}>⚠ {error}</div>
              )}

              <button type="submit" disabled={loading}
                style={{...S.btn, opacity:loading ? 0.75 : 1, cursor:loading?'not-allowed':'pointer'}}>
                {loading ? '⏳ Signing in...' : 'Sign In to ExpenseIQ →'}
              </button>

              {/* Divider */}
              <div style={S.div}>
                <div style={S.divLine}/>
                <span style={S.divTxt}>or continue with</span>
                <div style={S.divLine}/>
              </div>

              {/* Social logins */}
              <div style={S.socials}>
                <button type="button" style={S.socialBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button type="button" style={S.socialBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>

            </form>
          )}

          {/* ════ SIGNUP FORM — PERSONAL ONLY ════ */}
          {tab==='signup' && (
            <form onSubmit={handleSignup}>

              {/* First + Last name */}
              <div style={{...S.field, ...S.nameGrid}}>
                <div>
                  <div style={S.lbl}>First Name</div>
                  <div style={S.iw}>
                    <span style={S.ii}>👤</span>
                    <input type="text" value={firstName} placeholder="Rahul"
                      onChange={e=>setFirstName(e.target.value)}
                      onFocus={()=>setFocused('fn')} onBlur={()=>setFocused('')}
                      style={inp('fn')} required/>
                  </div>
                </div>
                <div>
                  <div style={S.lbl}>Last Name</div>
                  <div style={S.iw}>
                    <span style={S.ii}>👤</span>
                    <input type="text" value={lastName} placeholder="Sharma"
                      onChange={e=>setLastName(e.target.value)}
                      onFocus={()=>setFocused('ln')} onBlur={()=>setFocused('')}
                      style={inp('ln')} required/>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={S.field}>
                <div style={S.lbl}>Email Address</div>
                <div style={S.iw}>
                  <span style={S.ii}>📧</span>
                  <input type="email" value={signupEmail} placeholder="rahul@gmail.com"
                    onChange={e=>setSignupEmail(e.target.value)}
                    onFocus={()=>setFocused('se')} onBlur={()=>setFocused('')}
                    style={inp('se')} required/>
                </div>
              </div>

              {/* Phone */}
              <div style={S.field}>
                <div style={S.lbl}>Phone Number</div>
                <div style={S.iw}>
                  <span style={S.ii}>📱</span>
                  <input type="tel" value={phone} placeholder="+91 98765 43210"
                    onChange={e=>setPhone(e.target.value)}
                    onFocus={()=>setFocused('ph')} onBlur={()=>setFocused('')}
                    style={inp('ph')}/>
                </div>
              </div>

              {/* Currency + Monthly Budget */}
              <div style={S.field}>
                <div style={S.lbl}>Currency & Monthly Budget</div>
                <div style={S.currRow}>
                  <select value={currency} onChange={e=>setCurrency(e.target.value)}
                    onFocus={()=>setFocused('cur')} onBlur={()=>setFocused('')}
                    style={sel('cur')}>
                    {CURRENCIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                  <div style={S.iw}>
                    <span style={S.ii}>💰</span>
                    <input type="number" value={monthlyBudget} placeholder="25,000"
                      onChange={e=>setMonthlyBudget(e.target.value)}
                      onFocus={()=>setFocused('mb')} onBlur={()=>setFocused('')}
                      style={inp('mb')}/>
                  </div>
                </div>
                <div style={S.hint}>💡 Set your total monthly spending limit</div>
              </div>

              {/* Password */}
              <div style={S.field}>
                <div style={S.lbl}>Create Password</div>
                <div style={S.iw}>
                  <span style={S.ii}>🔑</span>
                  <input type={showPwd?'text':'password'} value={signupPwd}
                    placeholder="Min. 8 characters"
                    onChange={e=>{ setSignupPwd(e.target.value); calcStr(e.target.value) }}
                    onFocus={()=>setFocused('sp')} onBlur={()=>setFocused('')}
                    style={{...inp('sp'),paddingRight:40}} required/>
                  <button type="button" onClick={()=>setShowPwd(!showPwd)} style={S.eye}>
                    {showPwd?'🙈':'👁'}
                  </button>
                </div>
                <div style={S.strRow}>
                  {[1,2,3,4].map(i=>(
                    <div key={i} style={{...S.seg,background:i<=strength?STR_COLS[strength]:'#e4e9f7'}}/>
                  ))}
                </div>
                {signupPwd && <div style={{...S.strLbl,color:STR_COLS[strength]}}>{STR_LBLS[strength]}</div>}
              </div>

              {/* Confirm Password */}
              <div style={S.field}>
                <div style={S.lbl}>Confirm Password</div>
                <div style={S.iw}>
                  <span style={S.ii}>🔐</span>
                  <input type={showCPwd?'text':'password'} value={confirmPwd}
                    placeholder="Re-enter password"
                    onChange={e=>setConfirmPwd(e.target.value)}
                    onFocus={()=>setFocused('cp')} onBlur={()=>setFocused('')}
                    style={{
                      ...inp('cp'), paddingRight:40,
                      ...(confirmPwd && confirmPwd!==signupPwd ? {borderColor:'#ef4444'} : {}),
                      ...(confirmPwd && confirmPwd===signupPwd ? {borderColor:'#00c9a7'} : {}),
                    }} required/>
                  <button type="button" onClick={()=>setShowCPwd(!showCPwd)} style={S.eye}>
                    {showCPwd?'🙈':'👁'}
                  </button>
                </div>
                {confirmPwd && confirmPwd!==signupPwd &&
                  <div style={{fontSize:11,color:'#ef4444',marginTop:5}}>⚠ Passwords do not match</div>}
                {confirmPwd && confirmPwd===signupPwd &&
                  <div style={{fontSize:11,color:'#00c9a7',marginTop:5}}>✓ Passwords match</div>}
              </div>

              {/* Agree */}
              <label style={{...S.chkLbl, marginBottom:20, alignItems:'flex-start', gap:10}}>
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}
                  style={{accentColor:'#1a6bff',width:15,height:15,marginTop:2,flexShrink:0}}/>
                <span style={{fontSize:13,color:'#4a5578',lineHeight:1.5}}>
                  I agree to the{' '}
                  <a href="#" style={S.ssoLnk}>Terms of Service</a> and{' '}
                  <a href="#" style={S.ssoLnk}>Privacy Policy</a>
                </span>
              </label>

              {/* ── Error message from backend ── */}
              {error && (
                <div style={S.errorBox}>⚠ {error}</div>
              )}

              <button type="submit" disabled={loading || !agreed}
                style={{...S.btn, opacity:(loading||!agreed) ? 0.75 : 1, cursor:(loading||!agreed)?'not-allowed':'pointer'}}>
                {loading ? '⏳ Creating account...' : 'Create Free Account 🚀'}
              </button>

              <p style={{fontSize:12,color:'#8892b0',textAlign:'center',marginBottom:18}}>
                100% Free · No credit card · No hidden fees
              </p>

            </form>
          )}

          {/* Footer */}
          <div style={S.footer}>
            {tab==='login'
              ? <span>New here?{' '}
                  <a href="#" style={S.footerLnk}
                    onClick={e=>{ e.preventDefault(); setTab('signup'); setError('') }}>
                    Create free account →
                  </a></span>
              : <span>Already have an account?{' '}
                  <a href="#" style={S.footerLnk}
                    onClick={e=>{ e.preventDefault(); setTab('login'); setError('') }}>
                    Sign in →
                  </a></span>
            }
          </div>

          {/* Trust badges */}
          <div style={S.trust}>
            <div style={S.trustItem}><span>🔒</span> Secure</div>
            <div style={S.trustItem}><span>🆓</span> Always Free</div>
            <div style={S.trustItem}><span>🔏</span> Private</div>
          </div>

        </div>
      </div>
    </div>
  )
}