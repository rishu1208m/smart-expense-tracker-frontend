import React, { useState, useEffect, useRef } from 'react'
import { addExpense } from '../api/auth'
import { getToken } from '../api/storage'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

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
  const [title,       setTitle]       = useState('')
  const [amount,      setAmount]      = useState('')
  const [category,    setCategory]    = useState('')
  const [date,        setDate]        = useState(new Date().toISOString().split('T')[0])
  const [note,        setNote]        = useState('')
  const [receipt,     setReceipt]     = useState(null)
  const [receiptPrev, setReceiptPrev] = useState(null)
  const [uploading,   setUploading]   = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState(false)
  const [focused,     setFocused]     = useState('')
  const [visible,     setVisible]     = useState(false)
  const fileRef = useRef()

  useEffect(() => { setTimeout(() => setVisible(true), 10) }, [])

  const handleClose = () => { setVisible(false); setTimeout(onClose, 300) }

  const handleReceiptChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image too large. Max 5MB.'); return }
    setReceipt(file)
    setReceiptPrev(URL.createObjectURL(file))
    setError('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setReceipt(file)
      setReceiptPrev(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!category) { setError('Please select a category'); return }
    setLoading(true); setError('')
    try {
      const token = getToken()
      const expenseRes = await addExpense({ title, amount: Number(amount), category, date, note }, token)
      if (receipt && expenseRes?.id) {
        setUploading(true)
        const formData = new FormData()
        formData.append('file', receipt)
        await fetch(`${BASE_URL}/expenses/${expenseRes.id}/receipt`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        })
        setUploading(false)
      }
      setSuccess(true)
      setTimeout(() => { onAdded?.(); handleClose() }, 1200)
    } catch (err) {
      setError(err.message || 'Failed to add expense')
    } finally { setLoading(false); setUploading(false) }
  }

  const inp = (f) => ({
    width:'100%', padding:'13px 16px',
    background: focused===f ? '#fff' : '#f8faff',
    border:`1.5px solid ${focused===f ? '#1a6bff' : '#e4e9f7'}`,
    borderRadius:12, fontSize:14, color:'#0f1c3f', outline:'none',
    fontFamily:"'Plus Jakarta Sans',sans-serif", boxSizing:'border-box',
    transition:'all .2s', boxShadow: focused===f ? '0 0 0 3px rgba(26,107,255,.1)' : 'none',
  })

  const selectedCat = CATEGORIES.find(c => c.label === category)

  return (
    <>
      <div onClick={handleClose} style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(10,20,60,.45)', backdropFilter:'blur(6px)', transition:'opacity .3s', opacity: visible?1:0 }}/>
      <div style={{
        position:'fixed', top:'50%', left:'50%', zIndex:101,
        transform: visible ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(.92)',
        opacity: visible?1:0, transition:'all .3s cubic-bezier(.34,1.56,.64,1)',
        width:520, maxWidth:'95vw', background:'#fff',
        borderRadius:24, boxShadow:'0 32px 80px rgba(10,20,60,.25)',
        overflow:'hidden', fontFamily:"'Plus Jakarta Sans',sans-serif",
        maxHeight:'92vh', display:'flex', flexDirection:'column',
      }}>

        {/* Header */}
        <div style={{ padding:'24px 28px 20px', background:'linear-gradient(135deg,#0f1c3f,#1a6bff)', flexShrink:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.5)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>New Transaction</div>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#fff', margin:0 }}>Add Expense 💸</h2>
            </div>
            <button onClick={handleClose} style={{ width:36, height:36, borderRadius:'50%', border:'none', background:'rgba(255,255,255,.15)', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          </div>
          <div style={{ marginTop:16, padding:'12px 16px', background:'rgba(255,255,255,.1)', borderRadius:12, display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:26, fontWeight:800, color:'#fff' }}>{amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '₹0'}</span>
            {selectedCat && <span style={{ padding:'4px 12px', borderRadius:20, background:'rgba(255,255,255,.2)', fontSize:12, fontWeight:600, color:'#fff' }}>{selectedCat.icon} {selectedCat.label}</span>}
          </div>
        </div>

        {/* Form */}
        <div style={{ padding:'24px 28px 28px', overflowY:'auto', flex:1 }}>
          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Expense Title *</label>
              <input type="text" value={title} placeholder="e.g. Lunch at restaurant" onChange={e=>setTitle(e.target.value)} onFocus={()=>setFocused('title')} onBlur={()=>setFocused('')} style={inp('title')} required/>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Amount (₹) *</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, color:'#8892b0', pointerEvents:'none' }}>₹</span>
                  <input type="number" value={amount} placeholder="0.00" min="1" onChange={e=>setAmount(e.target.value)} onFocus={()=>setFocused('amount')} onBlur={()=>setFocused('')} style={{...inp('amount'), paddingLeft:30}} required/>
                </div>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Date *</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} onFocus={()=>setFocused('date')} onBlur={()=>setFocused('')} style={inp('date')} required/>
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Category *</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat.label} type="button" onClick={()=>setCategory(cat.label)} style={{
                    padding:'10px 6px', borderRadius:12, border:'2px solid',
                    borderColor: category===cat.label ? cat.color : '#e4e9f7',
                    background: category===cat.label ? cat.color+'18' : '#f8faff',
                    cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                    transition:'all .15s', transform: category===cat.label ? 'scale(1.05)' : 'scale(1)',
                  }}>
                    <span style={{ fontSize:20 }}>{cat.icon}</span>
                    <span style={{ fontSize:9, fontWeight:700, color: category===cat.label ? cat.color : '#8892b0', textAlign:'center', lineHeight:1.2, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{cat.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Note <span style={{ color:'#8892b0', fontWeight:400, textTransform:'none' }}>(optional)</span></label>
              <textarea value={note} placeholder="Add a note..." onChange={e=>setNote(e.target.value)} onFocus={()=>setFocused('note')} onBlur={()=>setFocused('')} rows={2} style={{ ...inp('note'), resize:'none', lineHeight:1.6, padding:'12px 16px' }}/>
            </div>

            {/* Receipt Upload */}
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Receipt 🧾 <span style={{ color:'#8892b0', fontWeight:400, textTransform:'none' }}>(optional)</span></label>
              {receiptPrev ? (
                <div style={{ position:'relative' }}>
                  <img src={receiptPrev} alt="Receipt" style={{ width:'100%', maxHeight:160, objectFit:'cover', borderRadius:12, border:'1.5px solid #e4e9f7' }}/>
                  <button type="button" onClick={()=>{ setReceipt(null); setReceiptPrev(null) }} style={{ position:'absolute', top:8, right:8, width:28, height:28, borderRadius:'50%', border:'none', background:'rgba(0,0,0,.6)', color:'#fff', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
                  <div style={{ fontSize:11, color:'#10b981', marginTop:6, fontWeight:600 }}>✅ {receipt?.name}</div>
                </div>
              ) : (
                <div onClick={()=>fileRef.current.click()} onDrop={handleDrop} onDragOver={e=>e.preventDefault()}
                  style={{ border:'2px dashed #c7d2fe', borderRadius:12, padding:'24px', textAlign:'center', cursor:'pointer', background:'#f8faff', transition:'all .2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='#1a6bff'; e.currentTarget.style.background='#eff6ff' }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='#c7d2fe'; e.currentTarget.style.background='#f8faff' }}
                >
                  <div style={{ fontSize:32, marginBottom:8 }}>📸</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#4a5578', marginBottom:4 }}>Click to upload or drag & drop</div>
                  <div style={{ fontSize:11, color:'#8892b0' }}>JPG, PNG, HEIC up to 5MB</div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleReceiptChange} style={{ display:'none' }}/>
                </div>
              )}
            </div>

            {error   && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#ef4444', marginBottom:16 }}>⚠ {error}</div>}
            {success && <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#16a34a', marginBottom:16 }}>✅ Expense added successfully!</div>}
            {uploading && <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#1a6bff', marginBottom:16 }}>📤 Uploading receipt...</div>}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
              <button type="button" onClick={handleClose} style={{ padding:'13px', borderRadius:12, border:'1.5px solid #e4e9f7', background:'#f8faff', fontSize:14, fontWeight:600, color:'#4a5578', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Cancel</button>
              <button type="submit" disabled={loading||success} style={{ padding:'13px', borderRadius:12, border:'none', background: success ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#1a6bff,#0d4fd9)', color:'#fff', fontSize:14, fontWeight:700, cursor: loading?'not-allowed':'pointer', opacity: loading?.8:1, fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:'0 4px 16px rgba(26,107,255,.3)', transition:'all .2s' }}>
                {uploading ? '📤 Uploading...' : loading ? '⏳ Saving...' : success ? '✅ Added!' : '+ Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}