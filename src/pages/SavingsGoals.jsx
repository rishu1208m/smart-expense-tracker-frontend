import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getToken } from '../api/storage'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const GOAL_ICONS = ['🏠','🚗','✈️','💍','📱','🎓','💪','🌴','💻','🎸','🐶','👶','🏋️','🛍️','💰']
const GOAL_COLORS = ['#1a6bff','#10b981','#f59e0b','#ec4899','#a855f7','#ff6b6b','#4ecdc4','#84cc16']

async function apiGoals(method, path, body, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(await res.text())
  return method === 'DELETE' ? null : res.json()
}

export default function SavingsGoals() {
  const [goals,      setGoals]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [showForm,   setShowForm]   = useState(false)
  const [addingTo,   setAddingTo]   = useState(null)  // goal id for adding money
  const [addAmount,  setAddAmount]  = useState('')
  const [error,      setError]      = useState('')
  const token = getToken()

  // New goal form state
  const [form, setForm] = useState({ name:'', targetAmount:'', icon:'🏠', color:'#1a6bff', deadline:'' })

  useEffect(() => {
    if (!token) return
    let isMounted = true
    apiGoals('GET', '/goals', null, token)
      .then(d  => { if (isMounted) { setLoading(false); setGoals(Array.isArray(d) ? d : []) } })
      .catch(e => { if (isMounted) { setLoading(false); setError(e.message) } })
    return () => { isMounted = false }
  }, [token])

  const fetchGoals = () => {
    if (!token) return
    setLoading(true)
    apiGoals('GET', '/goals', null, token)
      .then(d  => setGoals(Array.isArray(d) ? d : []))
      .catch(e => setError(e.message))
      .finally(()=> setLoading(false))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await apiGoals('POST', '/goals', {
        name: form.name,
        targetAmount: Number(form.targetAmount),
        icon: form.icon,
        color: form.color,
        deadline: form.deadline || null,
      }, token)
      setShowForm(false)
      setForm({ name:'', targetAmount:'', icon:'🏠', color:'#1a6bff', deadline:'' })
      fetchGoals()
    } catch(e) { setError(e.message) }
  }

  const handleAddMoney = async (goalId) => {
    if (!addAmount || isNaN(addAmount)) return
    try {
      await apiGoals('POST', `/goals/${goalId}/add`, { amount: Number(addAmount) }, token)
      setAddingTo(null)
      setAddAmount('')
      fetchGoals()
    } catch(e) { setError(e.message) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return
    try {
      await apiGoals('DELETE', `/goals/${id}`, null, token)
      setGoals(prev => prev.filter(g => g.id !== id))
    } catch(e) { setError(e.message) }
  }

  const inp = { width:'100%', padding:'12px 16px', border:'1.5px solid #e4e9f7', borderRadius:12, fontSize:14, outline:'none', fontFamily:"'Plus Jakarta Sans',sans-serif", boxSizing:'border-box', background:'#f8faff' }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f5f7ff', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <Sidebar />
      <main style={{ flex:1, padding:'40px 36px' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, color:'#0f1c3f', letterSpacing:'-.02em', marginBottom:4 }}>Savings Goals 🎯</h1>
            <p style={{ fontSize:14, color:'#8892b0' }}>{goals.length} active goals · Stay on track!</p>
          </div>
          <button onClick={()=>setShowForm(true)} style={{
            padding:'11px 22px', borderRadius:12, border:'none',
            background:'linear-gradient(135deg,#1a6bff,#0d4fd9)',
            color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer',
            fontFamily:"'Plus Jakarta Sans',sans-serif",
            boxShadow:'0 4px 16px rgba(26,107,255,.3)',
          }}>+ New Goal</button>
        </div>

        {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'12px 16px', marginBottom:20, color:'#ef4444', fontSize:14 }}>⚠ {error} — <em style={{fontSize:12}}>Make sure GoalsController is deployed to Railway</em></div>}

        {loading && <div style={{ textAlign:'center', padding:80, color:'#8892b0' }}>⏳ Loading goals...</div>}

        {/* Empty state */}
        {!loading && goals.length === 0 && (
          <div style={{ textAlign:'center', padding:'80px 20px', background:'#fff', borderRadius:20, border:'1px solid #e4e9f7' }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🎯</div>
            <h3 style={{ fontSize:18, fontWeight:700, color:'#0f1c3f', marginBottom:8 }}>No savings goals yet</h3>
            <p style={{ fontSize:14, color:'#8892b0', marginBottom:24 }}>Set a goal — a vacation, new phone, emergency fund — and track your progress</p>
            <button onClick={()=>setShowForm(true)} style={{ padding:'11px 24px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#1a6bff,#0d4fd9)', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              + Create First Goal
            </button>
          </div>
        )}

        {/* Goals Grid */}
        {!loading && goals.length > 0 && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px,1fr))', gap:20 }}>
            {goals.map(goal => {
              const pct     = Math.min(100, goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0)
              const done    = pct >= 100
              const daysLeft= goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / 86400000) : null
              return (
                <div key={goal.id} style={{
                  background:'#fff', borderRadius:20, padding:'24px',
                  border:`1px solid ${done ? '#bbf7d0' : '#e4e9f7'}`,
                  boxShadow: done ? '0 4px 20px rgba(16,185,129,.1)' : '0 2px 8px rgba(15,28,63,.05)',
                  position:'relative', overflow:'hidden',
                }}>
                  {done && (
                    <div style={{ position:'absolute', top:12, right:12, background:'#10b981', color:'#fff', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>
                      ✅ COMPLETE!
                    </div>
                  )}

                  {/* Icon + Name */}
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                    <div style={{
                      width:52, height:52, borderRadius:16, fontSize:26,
                      background: goal.color+'18',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      border:`2px solid ${goal.color}30`,
                    }}>{goal.icon || '🎯'}</div>
                    <div>
                      <div style={{ fontSize:16, fontWeight:700, color:'#0f1c3f' }}>{goal.name}</div>
                      {daysLeft !== null && (
                        <div style={{ fontSize:12, color: daysLeft < 30 ? '#ef4444' : '#8892b0', fontWeight:500 }}>
                          {daysLeft > 0 ? `⏰ ${daysLeft} days left` : '⚠ Deadline passed'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                      <span style={{ fontSize:13, color:'#4a5578' }}>
                        ₹{(goal.savedAmount||0).toLocaleString('en-IN')} saved
                      </span>
                      <span style={{ fontSize:13, fontWeight:700, color: goal.color }}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <div style={{ background:'#f0f4ff', borderRadius:8, height:10, overflow:'hidden' }}>
                      <div style={{
                        width:`${pct}%`, height:'100%', borderRadius:8,
                        background: done
                          ? 'linear-gradient(90deg,#10b981,#059669)'
                          : `linear-gradient(90deg,${goal.color},${goal.color}cc)`,
                        transition:'width .6s ease',
                      }}/>
                    </div>
                    <div style={{ fontSize:12, color:'#8892b0', marginTop:6 }}>
                      Goal: ₹{(goal.targetAmount||0).toLocaleString('en-IN')} · 
                      Remaining: ₹{Math.max(0,(goal.targetAmount||0)-(goal.savedAmount||0)).toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Add money inline */}
                  {addingTo === goal.id ? (
                    <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                      <div style={{ position:'relative', flex:1 }}>
                        <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#8892b0' }}>₹</span>
                        <input type="number" value={addAmount} onChange={e=>setAddAmount(e.target.value)}
                          placeholder="Amount" autoFocus
                          style={{ ...inp, paddingLeft:28 }}/>
                      </div>
                      <button onClick={()=>handleAddMoney(goal.id)} style={{ padding:'10px 16px', borderRadius:10, border:'none', background:'#10b981', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Add</button>
                      <button onClick={()=>{ setAddingTo(null); setAddAmount('') }} style={{ padding:'10px 12px', borderRadius:10, border:'1.5px solid #e4e9f7', background:'#fff', cursor:'pointer', fontSize:13 }}>✕</button>
                    </div>
                  ) : (
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={()=>setAddingTo(goal.id)} style={{
                        flex:1, padding:'9px', borderRadius:10, border:'none',
                        background: goal.color+'18', color: goal.color,
                        fontSize:13, fontWeight:700, cursor:'pointer',
                        fontFamily:"'Plus Jakarta Sans',sans-serif",
                      }}>+ Add Money</button>
                      <button onClick={()=>handleDelete(goal.id)} style={{ width:36, height:36, borderRadius:10, border:'1.5px solid #fecaca', background:'#fef2f2', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>🗑️</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Create Goal Modal */}
        {showForm && (
          <>
            <div onClick={()=>setShowForm(false)} style={{ position:'fixed', inset:0, background:'rgba(10,20,60,.45)', backdropFilter:'blur(6px)', zIndex:100 }}/>
            <div style={{
              position:'fixed', top:'50%', left:'50%', zIndex:101,
              transform:'translate(-50%,-50%)',
              width:480, maxWidth:'95vw', background:'#fff',
              borderRadius:24, boxShadow:'0 32px 80px rgba(10,20,60,.25)',
              overflow:'hidden', fontFamily:"'Plus Jakarta Sans',sans-serif",
            }}>
              {/* Modal Header */}
              <div style={{ padding:'24px 28px 20px', background:'linear-gradient(135deg,#0f1c3f,#1a6bff)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <h2 style={{ fontSize:20, fontWeight:800, color:'#fff', margin:0 }}>Create Savings Goal 🎯</h2>
                  <button onClick={()=>setShowForm(false)} style={{ width:32, height:32, borderRadius:'50%', border:'none', background:'rgba(255,255,255,.2)', color:'#fff', fontSize:18, cursor:'pointer' }}>×</button>
                </div>
              </div>

              <form onSubmit={handleCreate} style={{ padding:'24px 28px 28px' }}>
                {/* Goal Name */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Goal Name *</label>
                  <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Dream Vacation, New iPhone" style={inp} required/>
                </div>

                {/* Target Amount */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Target Amount (₹) *</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#8892b0' }}>₹</span>
                    <input type="number" value={form.targetAmount} onChange={e=>setForm({...form,targetAmount:e.target.value})} placeholder="50000" style={{ ...inp, paddingLeft:28 }} required/>
                  </div>
                </div>

                {/* Deadline */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Deadline <span style={{ color:'#8892b0', fontWeight:400, textTransform:'none' }}>(optional)</span></label>
                  <input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} style={inp}/>
                </div>

                {/* Icon picker */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Icon</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {GOAL_ICONS.map(ic => (
                      <button key={ic} type="button" onClick={()=>setForm({...form,icon:ic})} style={{
                        width:40, height:40, borderRadius:10, border:`2px solid ${form.icon===ic ? '#1a6bff' : '#e4e9f7'}`,
                        background: form.icon===ic ? '#1a6bff18' : '#f8faff',
                        fontSize:20, cursor:'pointer',
                      }}>{ic}</button>
                    ))}
                  </div>
                </div>

                {/* Color picker */}
                <div style={{ marginBottom:24 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:'#4a5578', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Color</label>
                  <div style={{ display:'flex', gap:8 }}>
                    {GOAL_COLORS.map(c => (
                      <button key={c} type="button" onClick={()=>setForm({...form,color:c})} style={{
                        width:32, height:32, borderRadius:'50%', background:c, border:'none', cursor:'pointer',
                        boxShadow: form.color===c ? `0 0 0 3px #fff, 0 0 0 5px ${c}` : 'none',
                        transition:'box-shadow .15s',
                      }}/>
                    ))}
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
                  <button type="button" onClick={()=>setShowForm(false)} style={{ padding:'13px', borderRadius:12, border:'1.5px solid #e4e9f7', background:'#f8faff', fontSize:14, fontWeight:600, color:'#4a5578', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Cancel</button>
                  <button type="submit" style={{ padding:'13px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#1a6bff,#0d4fd9)', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:'0 4px 16px rgba(26,107,255,.3)' }}>Create Goal 🎯</button>
                </div>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  )
}