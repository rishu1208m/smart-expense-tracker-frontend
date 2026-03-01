import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import AddExpenseModal from '../components/AddExpenseModal'
import { getExpenses, deleteExpense } from '../api/auth'
import { getToken } from '../api/storage'

const CATEGORY_COLORS = {
  'Food & Dining':  { bg:'#fff1f1', color:'#ef4444', icon:'🍜' },
  'Transport':      { bg:'#f0fdfa', color:'#0d9488', icon:'🚗' },
  'Shopping':       { bg:'#faf5ff', color:'#9333ea', icon:'🛍️' },
  'Entertainment':  { bg:'#fffbeb', color:'#d97706', icon:'🎬' },
  'Health':         { bg:'#f0fdf4', color:'#16a34a', icon:'💊' },
  'Bills':          { bg:'#eff6ff', color:'#2563eb', icon:'📱' },
  'Education':      { bg:'#eef2ff', color:'#4f46e5', icon:'📚' },
  'Travel':         { bg:'#fdf2f8', color:'#db2777', icon:'✈️' },
  'Groceries':      { bg:'#f7fee7', color:'#65a30d', icon:'🛒' },
  'Other':          { bg:'#f8faff', color:'#8892b0', icon:'💡' },
}

export default function Expenses() {
  const [expenses,   setExpenses]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [showModal,  setShowModal]  = useState(false)
  const [deleting,   setDeleting]   = useState(null)
  const [search,     setSearch]     = useState('')
  const [filterCat,  setFilterCat]  = useState('All')
  const token = getToken()

  const fetchExpenses = () => {
    setLoading(true)
    getExpenses(token)
      .then(data => setExpenses(Array.isArray(data) ? data : []))
      .catch(e   => setError(e.message))
      .finally(()=> setLoading(false))
  }

  useEffect(() => { fetchExpenses() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    setDeleting(id)
    try {
      await deleteExpense(id, token)
      setExpenses(prev => prev.filter(e => e.id !== id))
    } catch (e) {
      setError(e.message)
    } finally {
      setDeleting(null)
    }
  }

  // Filter + search
  const categories = ['All', ...new Set(expenses.map(e => e.category).filter(Boolean))]
  const filtered = expenses.filter(e => {
    const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase()) ||
                        e.category?.toLowerCase().includes(search.toLowerCase())
    const matchCat    = filterCat === 'All' || e.category === filterCat
    return matchSearch && matchCat
  })

  const totalFiltered = filtered.reduce((sum, e) => sum + (e.amount || 0), 0)

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f5f7ff', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <Sidebar />
      <main style={{ flex:1, padding:'40px 36px' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, color:'#0f1c3f', letterSpacing:'-.02em', marginBottom:4 }}>
              My Expenses
            </h1>
            <p style={{ fontSize:14, color:'#8892b0' }}>
              {expenses.length} total · ₹{totalFiltered.toLocaleString('en-IN')} shown
            </p>
          </div>
          <button onClick={()=>setShowModal(true)} style={{
            padding:'11px 22px', borderRadius:12, border:'none',
            background:'linear-gradient(135deg,#1a6bff,#0d4fd9)',
            color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer',
            fontFamily:"'Plus Jakarta Sans',sans-serif",
            boxShadow:'0 4px 16px rgba(26,107,255,.3)',
          }}>
            + Add Expense
          </button>
        </div>

        {/* Search + Filter */}
        <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, pointerEvents:'none' }}>🔍</span>
            <input
              type="text" value={search} placeholder="Search expenses..."
              onChange={e=>setSearch(e.target.value)}
              style={{
                width:'100%', padding:'11px 16px 11px 40px',
                background:'#fff', border:'1.5px solid #e4e9f7',
                borderRadius:12, fontSize:14, color:'#0f1c3f',
                outline:'none', fontFamily:"'Plus Jakarta Sans',sans-serif",
                boxSizing:'border-box',
              }}
            />
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={()=>setFilterCat(cat)} style={{
                padding:'10px 16px', borderRadius:10, border:'1.5px solid',
                borderColor: filterCat===cat ? '#1a6bff' : '#e4e9f7',
                background:  filterCat===cat ? '#1a6bff' : '#fff',
                color:       filterCat===cat ? '#fff' : '#4a5578',
                fontSize:13, fontWeight:600, cursor:'pointer',
                fontFamily:"'Plus Jakarta Sans',sans-serif",
                transition:'all .15s',
              }}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'12px 16px', marginBottom:20, fontSize:14, color:'#ef4444' }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:'center', padding:80, color:'#8892b0' }}>⏳ Loading expenses...</div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{
            textAlign:'center', padding:'60px 20px',
            background:'#fff', borderRadius:20, border:'1px solid #e4e9f7',
          }}>
            <div style={{ fontSize:48, marginBottom:16 }}>💸</div>
            <div style={{ fontSize:18, fontWeight:700, color:'#0f1c3f', marginBottom:8 }}>No expenses yet</div>
            <div style={{ fontSize:14, color:'#8892b0', marginBottom:24 }}>
              {search || filterCat !== 'All' ? 'No expenses match your filter' : 'Add your first expense to get started!'}
            </div>
            {!search && filterCat === 'All' && (
              <button onClick={()=>setShowModal(true)} style={{
                padding:'12px 24px', borderRadius:12, border:'none',
                background:'linear-gradient(135deg,#1a6bff,#0d4fd9)',
                color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer',
                fontFamily:"'Plus Jakarta Sans',sans-serif",
              }}>+ Add First Expense</button>
            )}
          </div>
        )}

        {/* Expenses Table */}
        {!loading && filtered.length > 0 && (
          <div style={{ background:'#fff', borderRadius:20, border:'1px solid #e4e9f7', overflow:'hidden', boxShadow:'0 2px 8px rgba(15,28,63,.05)' }}>
            {/* Table Header */}
            <div style={{
              display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 80px',
              padding:'14px 24px', background:'#f8faff',
              borderBottom:'1px solid #e4e9f7',
              fontSize:11, fontWeight:700, color:'#8892b0',
              letterSpacing:'.06em', textTransform:'uppercase',
            }}>
              <span>Expense</span>
              <span>Category</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Action</span>
            </div>

            {/* Rows */}
            {filtered.map((exp, i) => {
              const cat = CATEGORY_COLORS[exp.category] || CATEGORY_COLORS['Other']
              return (
                <div key={exp.id} style={{
                  display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 80px',
                  padding:'16px 24px', borderBottom: i < filtered.length-1 ? '1px solid #f0f4ff' : 'none',
                  alignItems:'center', transition:'background .15s',
                  background: deleting===exp.id ? '#fef2f2' : 'transparent',
                }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f8faff'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                >
                  {/* Title */}
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{
                      width:40, height:40, borderRadius:12,
                      background:cat.bg, display:'flex',
                      alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0,
                    }}>{cat.icon}</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:'#0f1c3f', marginBottom:2 }}>
                        {exp.title || 'Untitled'}
                      </div>
                      {exp.note && (
                        <div style={{ fontSize:12, color:'#8892b0' }}>{exp.note}</div>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <span style={{
                    display:'inline-flex', padding:'4px 10px', borderRadius:20,
                    background:cat.bg, color:cat.color,
                    fontSize:12, fontWeight:600,
                  }}>{exp.category || 'Other'}</span>

                  {/* Date */}
                  <span style={{ fontSize:13, color:'#8892b0' }}>
                    {exp.date ? new Date(exp.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}
                  </span>

                  {/* Amount */}
                  <span style={{ fontSize:15, fontWeight:700, color:'#0f1c3f' }}>
                    ₹{(exp.amount || 0).toLocaleString('en-IN')}
                  </span>

                  {/* Delete */}
                  <button onClick={()=>handleDelete(exp.id)} disabled={deleting===exp.id} style={{
                    width:34, height:34, borderRadius:10, border:'1.5px solid #fecaca',
                    background:'#fef2f2', color:'#ef4444', fontSize:14,
                    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'all .15s', opacity: deleting===exp.id ? .5 : 1,
                  }}>🗑</button>
                </div>
              )
            })}

            {/* Footer total */}
            <div style={{
              display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 80px',
              padding:'14px 24px', background:'#f8faff',
              borderTop:'2px solid #e4e9f7',
            }}>
              <span style={{ fontSize:13, fontWeight:700, color:'#0f1c3f' }}>
                {filtered.length} expense{filtered.length !== 1 ? 's' : ''}
              </span>
              <span/><span/>
              <span style={{ fontSize:15, fontWeight:800, color:'#1a6bff' }}>
                ₹{totalFiltered.toLocaleString('en-IN')}
              </span>
              <span/>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <AddExpenseModal
          onClose={()=>setShowModal(false)}
          onAdded={()=>{ setShowModal(false); fetchExpenses() }}
        />
      )}
    </div>
  )
}