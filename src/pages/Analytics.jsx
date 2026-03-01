import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getAnalytics } from '../api/auth'
import { getToken } from '../api/storage'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

const COLORS = ['#1a6bff','#00c9a7','#ff6b6b','#f59e0b','#a855f7','#ec4899','#10b981','#3b82f6','#84cc16','#8892b0']

const StatCard = ({ icon, label, value, sub, color }) => (
  <div style={{
    background:'#fff', borderRadius:16, padding:'20px 22px',
    border:'1px solid #e4e9f7', boxShadow:'0 2px 8px rgba(15,28,63,.04)',
  }}>
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
      <div style={{
        width:40, height:40, borderRadius:12,
        background: color + '18',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
      }}>{icon}</div>
      <span style={{ fontSize:12, fontWeight:600, color:'#8892b0', textTransform:'uppercase', letterSpacing:'.05em' }}>{label}</span>
    </div>
    <div style={{ fontSize:26, fontWeight:800, color:'#0f1c3f', letterSpacing:'-.02em' }}>{value}</div>
    {sub && <div style={{ fontSize:12, color:'#8892b0', marginTop:4 }}>{sub}</div>}
  </div>
)

export default function Analytics() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const token = getToken()

  useEffect(() => {
    getAnalytics(token)
      .then(d  => setData(d))
      .catch(e => setError(e.message))
      .finally(()=> setLoading(false))
  }, [])

  // Prepare chart data
  const categoryData = data?.categoryBreakdown
    ? Object.entries(data.categoryBreakdown).map(([name, value]) => ({ name, value }))
    : []

  const monthlyData = data?.monthlyBreakdown
    ? Object.entries(data.monthlyBreakdown).map(([month, spent]) => ({ month, spent }))
    : []

  const topCategory = categoryData.length
    ? categoryData.reduce((a,b) => a.value > b.value ? a : b)
    : null

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f5f7ff', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <Sidebar />
      <main style={{ flex:1, padding:'40px 36px' }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#0f1c3f', letterSpacing:'-.02em', marginBottom:4 }}>
            Analytics
          </h1>
          <p style={{ fontSize:14, color:'#8892b0' }}>
            Understand your spending patterns and habits
          </p>
        </div>

        {error && (
          <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'12px 16px', marginBottom:20, fontSize:14, color:'#ef4444' }}>
            ⚠ {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign:'center', padding:80, color:'#8892b0' }}>⏳ Loading analytics...</div>
        )}

        {!loading && (
          <>
            {/* Stat Cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:28 }}>
              <StatCard
                icon="💸" label="Total Spent" color="#1a6bff"
                value={`₹${(data?.totalAmount || 0).toLocaleString('en-IN')}`}
                sub="All time"
              />
              <StatCard
                icon="📊" label="Total Expenses" color="#00c9a7"
                value={data?.totalCount || 0}
                sub="transactions"
              />
              <StatCard
                icon="🏆" label="Top Category" color="#f59e0b"
                value={topCategory?.name || '—'}
                sub={topCategory ? `₹${topCategory.value.toLocaleString('en-IN')}` : 'No data yet'}
              />
            </div>

            {/* Charts Row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>

              {/* Pie Chart */}
              <div style={{ background:'#fff', borderRadius:20, padding:'24px', border:'1px solid #e4e9f7', boxShadow:'0 2px 8px rgba(15,28,63,.05)' }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#0f1c3f', marginBottom:20, margin:'0 0 20px' }}>
                  Spending by Category
                </h3>
                {categoryData.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'40px 0', color:'#8892b0' }}>
                    <div style={{ fontSize:36, marginBottom:8 }}>📊</div>
                    <div>No data yet — add some expenses!</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" nameKey="name"
                        cx="50%" cy="50%" outerRadius={90} innerRadius={50}
                        paddingAngle={3}>
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Amount']}
                        contentStyle={{ borderRadius:10, border:'1px solid #e4e9f7', fontSize:13 }}/>
                      <Legend iconType="circle" iconSize={8}
                        formatter={(v) => <span style={{ fontSize:12, color:'#4a5578' }}>{v}</span>}/>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Bar Chart */}
              <div style={{ background:'#fff', borderRadius:20, padding:'24px', border:'1px solid #e4e9f7', boxShadow:'0 2px 8px rgba(15,28,63,.05)' }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#0f1c3f', margin:'0 0 20px' }}>
                  Monthly Breakdown
                </h3>
                {monthlyData.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'40px 0', color:'#8892b0' }}>
                    <div style={{ fontSize:36, marginBottom:8 }}>📈</div>
                    <div>No monthly data yet</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={monthlyData} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff"/>
                      <XAxis dataKey="month" tick={{ fontSize:11, fill:'#8892b0' }}/>
                      <YAxis tick={{ fontSize:11, fill:'#8892b0' }}/>
                      <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Spent']}
                        contentStyle={{ borderRadius:10, border:'1px solid #e4e9f7', fontSize:13 }}/>
                      <Bar dataKey="spent" fill="#1a6bff" radius={[6,6,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Category Breakdown Table */}
            {categoryData.length > 0 && (
              <div style={{ background:'#fff', borderRadius:20, border:'1px solid #e4e9f7', overflow:'hidden', boxShadow:'0 2px 8px rgba(15,28,63,.05)' }}>
                <div style={{ padding:'20px 24px', borderBottom:'1px solid #e4e9f7' }}>
                  <h3 style={{ fontSize:16, fontWeight:700, color:'#0f1c3f', margin:0 }}>Category Breakdown</h3>
                </div>
                {categoryData
                  .sort((a,b) => b.value - a.value)
                  .map((cat, i) => {
                    const pct = data?.totalAmount ? Math.round((cat.value / data.totalAmount) * 100) : 0
                    return (
                      <div key={cat.name} style={{
                        padding:'16px 24px',
                        borderBottom: i < categoryData.length-1 ? '1px solid #f0f4ff' : 'none',
                      }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:10, height:10, borderRadius:'50%', background:COLORS[i % COLORS.length] }}/>
                            <span style={{ fontSize:14, fontWeight:600, color:'#0f1c3f' }}>{cat.name}</span>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                            <span style={{ fontSize:12, color:'#8892b0' }}>{pct}%</span>
                            <span style={{ fontSize:15, fontWeight:700, color:'#0f1c3f' }}>
                              ₹{cat.value.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <div style={{ height:6, background:'#f0f4ff', borderRadius:3 }}>
                          <div style={{ height:'100%', borderRadius:3, width:`${pct}%`, background:COLORS[i % COLORS.length], transition:'width .5s ease' }}/>
                        </div>
                      </div>
                    )
                  })}

                {/* AI Insight */}
                {data?.insight && (
                  <div style={{
                    margin:'0 24px 24px', padding:'16px', marginTop:16,
                    background:'linear-gradient(135deg,#eff6ff,#f5f3ff)',
                    borderRadius:14, border:'1px solid #dbeafe',
                  }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#1a6bff', marginBottom:6, display:'flex', alignItems:'center', gap:6 }}>
                      🤖 AI Insight
                    </div>
                    <p style={{ fontSize:13, color:'#4a5578', lineHeight:1.6, margin:0 }}>
                      {data.insight}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}