import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ExpenseCard from '../components/ExpenseCard'
import AddExpenseModal from '../components/AddExpenseModal'
import { getDashboard } from '../api/auth'
import { getToken, getUser } from '../api/storage'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Dashboard() {
  const [data,       setData]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [showModal,  setShowModal]  = useState(false)
  const token = getToken()
  const user  = getUser()

  useEffect(() => {
    const fetchDashboard = () => {
      if (!token) { setError('Session expired. Please login again.'); setLoading(false); return }
      getDashboard(token)
        .then(d  => setData(d))
        .catch(e => setError(e.message))
        .finally(()=> setLoading(false))
    }
    fetchDashboard()
  }, [token])

  const chartData = data?.monthlySpend || [
    { month: 'Jan', spent: 0 }, { month: 'Feb', spent: 0 },
    { month: 'Mar', spent: 0 }, { month: 'Apr', spent: 0 },
    { month: 'May', spent: 0 }, { month: 'Jun', spent: 0 },
    { month: 'Jul', spent: 0 }, { month: 'Aug', spent: 0 },
  ]

  const cards = [
    { label: 'Total Spent',        value: data?.totalSpent   ?? '—', change: 'this month',  up: false, icon: '💸' },
    { label: 'Budget Left',        value: data?.budgetLeft   ?? '—', change: 'remaining',   up: true,  icon: '🎯' },
    { label: 'Expenses Filed',     value: data?.expenseCount ?? '—', change: 'this month',  up: true,  icon: '📄' },
    { label: 'Savings This Month', value: data?.savings      ?? '—', change: 'saved',       up: true,  icon: '💰' },
  ]

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f5f7ff', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <Sidebar />
      <main style={{ flex:1, padding:'40px 36px' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, color:'#0f1c3f', letterSpacing:'-.02em', marginBottom:4 }}>
              Dashboard
            </h1>
            <p style={{ fontSize:14, color:'#8892b0' }}>
              Welcome back, <strong style={{ color:'#0f1c3f' }}>{user?.name || 'User'}</strong>! Here is your financial overview.
            </p>
          </div>
          <button
            onClick={()=>setShowModal(true)}
            style={{
              padding:'11px 22px', borderRadius:12, border:'none',
              background:'linear-gradient(135deg,#1a6bff,#0d4fd9)',
              color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer',
              fontFamily:"'Plus Jakarta Sans',sans-serif",
              boxShadow:'0 4px 16px rgba(26,107,255,.3)',
              display:'flex', alignItems:'center', gap:8,
              transition:'transform .15s',
            }}
            onMouseEnter={e=>e.target.style.transform='translateY(-1px)'}
            onMouseLeave={e=>e.target.style.transform='translateY(0)'}
          >
            + Add Expense
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12,
            padding:'12px 16px', marginBottom:24, fontSize:14, color:'#ef4444',
            display:'flex', alignItems:'center', justifyContent:'space-between',
          }}>
            <span>⚠ {error}</span>
            {error.includes('Session') && (
              <a href="/login" style={{ color:'#1a6bff', fontWeight:600, fontSize:13 }}>Login again →</a>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:'center', padding:60, color:'#8892b0', fontSize:14 }}>
            ⏳ Loading your data...
          </div>
        )}

        {!loading && (
          <>
            {/* Stat Cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
              {cards.map(c=><ExpenseCard key={c.label} {...c}/>)}
            </div>

            {/* Chart */}
            <div style={{
              background:'#fff', borderRadius:20, padding:'28px 28px 20px',
              border:'1px solid #e4e9f7', boxShadow:'0 2px 8px rgba(15,28,63,.05)',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#0f1c3f', margin:0 }}>
                  Monthly Spend Trend
                </h3>
                <span style={{ fontSize:12, color:'#8892b0' }}>Last 8 months</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff"/>
                  <XAxis dataKey="month" tick={{ fontSize:12, fill:'#8892b0' }}/>
                  <YAxis tick={{ fontSize:12, fill:'#8892b0' }}/>
                  <Tooltip contentStyle={{ borderRadius:10, border:'1px solid #e4e9f7', fontSize:13 }}/>
                  <Line type="monotone" dataKey="spent" stroke="#1a6bff" strokeWidth={2.5}
                    dot={{ fill:'#1a6bff', r:4 }} activeDot={{ r:6, fill:'#1a6bff' }}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>

      {/* Add Expense Modal */}
      {showModal && (
        <AddExpenseModal
          onClose={()=>setShowModal(false)}
          onAdded={() => {
            setShowModal(false);
            if (token) {
              getDashboard(token)
                .then(d => setData(d))
                .catch(e => setError(e.message))
            }
          }}
        />
      )}
    </div>
  )
}