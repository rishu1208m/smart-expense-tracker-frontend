import React, { useState, useEffect } from 'react'
import { addExpense } from '../api/auth'
import { getToken } from '../api/storage'

const CATEGORIES = [
  { label: 'Food & Dining',   icon: '🍜', color: '#ff6b6b' },
  { label: 'Transport',       icon: '🚗', color: '#4ecdc4' },
  { label: 'Shopping',        icon: '🛍️', color: '#a855f7' },
  { label: 'Entertainment',   icon: '🎬', color: '#f59e0b' },
  { label: 'Health',          icon: '💊', color: '#10b981' },
  { label: 'Bills',           icon: '📱', color: '#3b82f6' },
  { label: 'Education',       icon: '📚', color: '#6366f1' },
  { label: 'Travel',          icon: '✈️', color: '#ec4899' },
  { label: 'Groceries',       icon: '🛒', color: '#84cc16' },
  { label: 'Other',           icon: '💡', color: '#8892b0' },
]

export default function AddExpenseModal({ onClose, onAdded }) {
  const [title,    setTitle]    = useState('')
  const [amount,   setAmount]   = useState('')
  const [category, setCategory] = useState('')
  const [date,     setDate]     = useState(new Date().toISOString().split('T')[0])
  const [note,     setNote]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState(false)
  const [focused,  setFocused]  = useState('')
  const [visible,  setVisible]  = useState(false)

  // Animate in on mount
  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!category) { setError('Please select a category'); return }

    setLoading(true)
    setError('')
    try {
      const token = getToken()
      await addExpense({ title, amount: Number(amount), category, date, note }, token)
      setSuccess(true)
      setTimeout(() => {
        onAdded?.()   // refresh dashboard
        handleClose()
      }, 1200)
    } catch (err) {
      setError(err.message || 'Failed to add expense')
    } finally {
      setLoading(false)
    }
  }

  const inp = (f) => ({
    width: '100%',
    padding: '13px 16px',
    background: focused === f ? '#fff' : '#f8faff',
    border: `1.5px solid ${focused === f ? '#1a6bff' : '#e4e9f7'}`,
    borderRadius: 12,
    fontSize: 14,
    color: '#0f1c3f',
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxSizing: 'border-box',
    transition: 'all .2s',
    boxShadow: focused === f ? '0 0 0 3px rgba(26,107,255,.1)' : 'none',
  })

  const selectedCat = CATEGORIES.find(c => c.label === category)

  return (
    <>
      {/* ── Backdrop ── */}
      <div onClick={handleClose} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(10,20,60,.45)',
        backdropFilter: 'blur(6px)',
        transition: 'opacity .3s',
        opacity: visible ? 1 : 0,
      }}/>

      {/* ── Modal ── */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%', zIndex: 101,
        transform: visible
          ? 'translate(-50%,-50%) scale(1)'
          : 'translate(-50%,-50%) scale(.92)',
        opacity: visible ? 1 : 0,
        transition: 'all .3s cubic-bezier(.34,1.56,.64,1)',
        width: 520, maxWidth: '95vw',
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 32px 80px rgba(10,20,60,.25)',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '28px 28px 20px',
          background: 'linear-gradient(135deg,#0f1c3f 0%,#1a6bff 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* decorative circles */}
          {[[140,'-30%','-20%'],[80,'85%','60%'],[50,'60%','-40%']].map(([s,l,t],i)=>(
            <div key={i} style={{
              position:'absolute', width:s, height:s, borderRadius:'50%',
              left:l, top:t,
              background:'rgba(255,255,255,.07)',
              pointerEvents:'none',
            }}/>
          ))}
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.5)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>
                  New Transaction
                </div>
                <h2 style={{ fontSize:22, fontWeight:800, color:'#fff', margin:0, letterSpacing:'-.02em' }}>
                  Add Expense 💸
                </h2>
              </div>
              <button onClick={handleClose} style={{
                width:36, height:36, borderRadius:'50%', border:'none',
                background:'rgba(255,255,255,.15)', color:'#fff',
                fontSize:18, cursor:'pointer', display:'flex',
                alignItems:'center', justifyContent:'center',
                backdropFilter:'blur(4px)',
              }}>×</button>
            </div>

            {/* Amount preview */}
            <div style={{
              marginTop:20, padding:'14px 18px',
              background:'rgba(255,255,255,.1)',
              borderRadius:14, backdropFilter:'blur(8px)',
              border:'1px solid rgba(255,255,255,.15)',
              display:'flex', alignItems:'center', gap:12,
            }}>
              <span style={{ fontSize:28, fontWeight:800, color:'#fff' }}>
                {amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '₹0'}
              </span>
              {selectedCat && (
                <span style={{
                  padding:'4px 12px', borderRadius:20,
                  background:'rgba(255,255,255,.2)',
                  fontSize:12, fontWeight:600, color:'#fff',
                  display:'flex', alignItems:'center', gap:6,
                }}>
                  {selectedCat.icon} {selectedCat.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Form ── */}
        <div style={{ padding:'24px 28px 28px', maxHeight:'70vh', overflowY:'auto' }}>
          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>
                Expense Title *
              </label>
              <input
                type="text" value={title} placeholder="e.g. Lunch at restaurant"
                onChange={e=>setTitle(e.target.value)}
                onFocus={()=>setFocused('title')} onBlur={()=>setFocused('')}
                style={inp('title')} required
              />
            </div>

            {/* Amount + Date row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>
                  Amount (₹) *
                </label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, color:'#8892b0', pointerEvents:'none' }}>₹</span>
                  <input
                    type="number" value={amount} placeholder="0.00" min="1"
                    onChange={e=>setAmount(e.target.value)}
                    onFocus={()=>setFocused('amount')} onBlur={()=>setFocused('')}
                    style={{...inp('amount'), paddingLeft:30}} required
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>
                  Date *
                </label>
                <input
                  type="date" value={date}
                  onChange={e=>setDate(e.target.value)}
                  onFocus={()=>setFocused('date')} onBlur={()=>setFocused('')}
                  style={inp('date')} required
                />
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>
                Category *
              </label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat.label} type="button"
                    onClick={()=>setCategory(cat.label)}
                    style={{
                      padding:'10px 6px', borderRadius:12, border:'2px solid',
                      borderColor: category===cat.label ? cat.color : '#e4e9f7',
                      background: category===cat.label ? cat.color+'18' : '#f8faff',
                      cursor:'pointer', display:'flex', flexDirection:'column',
                      alignItems:'center', gap:4, transition:'all .15s',
                      transform: category===cat.label ? 'scale(1.05)' : 'scale(1)',
                    }}>
                    <span style={{ fontSize:20 }}>{cat.icon}</span>
                    <span style={{
                      fontSize:9, fontWeight:700, color: category===cat.label ? cat.color : '#8892b0',
                      textAlign:'center', lineHeight:1.2, fontFamily:"'Plus Jakarta Sans',sans-serif",
                    }}>
                      {cat.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>
                Note <span style={{ color:'#8892b0', fontWeight:400, textTransform:'none' }}>(optional)</span>
              </label>
              <textarea
                value={note} placeholder="Add a note..."
                onChange={e=>setNote(e.target.value)}
                onFocus={()=>setFocused('note')} onBlur={()=>setFocused('')}
                rows={2}
                style={{
                  ...inp('note'),
                  resize:'none', lineHeight:1.6,
                  padding:'12px 16px',
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background:'#fef2f2', border:'1px solid #fecaca',
                borderRadius:10, padding:'10px 14px',
                fontSize:13, color:'#ef4444', marginBottom:16,
                display:'flex', alignItems:'center', gap:8,
              }}>⚠ {error}</div>
            )}

            {/* Success */}
            {success && (
              <div style={{
                background:'#f0fdf4', border:'1px solid #bbf7d0',
                borderRadius:10, padding:'10px 14px',
                fontSize:13, color:'#16a34a', marginBottom:16,
                display:'flex', alignItems:'center', gap:8,
                animation:'fadeIn .3s ease',
              }}>✅ Expense added successfully!</div>
            )}

            {/* Buttons */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
              <button type="button" onClick={handleClose} style={{
                padding:'13px', borderRadius:12,
                border:'1.5px solid #e4e9f7', background:'#f8faff',
                fontSize:14, fontWeight:600, color:'#4a5578',
                cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif",
              }}>
                Cancel
              </button>
              <button type="submit" disabled={loading || success} style={{
                padding:'13px', borderRadius:12, border:'none',
                background: success
                  ? 'linear-gradient(135deg,#10b981,#059669)'
                  : 'linear-gradient(135deg,#1a6bff,#0d4fd9)',
                color:'#fff', fontSize:14, fontWeight:700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? .8 : 1,
                fontFamily:"'Plus Jakarta Sans',sans-serif",
                boxShadow:'0 4px 16px rgba(26,107,255,.3)',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                transition:'all .2s',
              }}>
                {loading ? '⏳ Saving...' : success ? '✅ Added!' : '+ Add Expense'}
              </button>
            </div>

          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </>
  )
}