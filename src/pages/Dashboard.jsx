import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ExpenseCard from '../components/ExpenseCard'
import { getDashboard } from '../api/auth'
import { getToken, getUser } from '../api/storage'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Dashboard() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const token = getToken()
  const user  = getUser()

  useEffect(() => {
    getDashboard(token)
      .then(d  => setData(d))
      .catch(e => setError(e.message))
      .finally(()=> setLoading(false))
  }, [])

  // Fallback data while loading or if API not ready
  const chartData = data?.monthlySpend || [
    { month: 'Jan', spent: 3200 }, { month: 'Feb', spent: 4100 },
    { month: 'Mar', spent: 2800 }, { month: 'Apr', spent: 5200 },
    { month: 'May', spent: 4600 }, { month: 'Jun', spent: 6100 },
    { month: 'Jul', spent: 5400 }, { month: 'Aug', spent: 8400 },
  ]

  const cards = [
    { label: 'Total Spent',       value: data?.totalSpent       ?? '—', change: data?.spentChange      ?? '—', up: false, icon: '💸' },
    { label: 'Budget Left',       value: data?.budgetLeft       ?? '—', change: data?.budgetChange     ?? '—', up: true,  icon: '🎯' },
    { label: 'Expenses Filed',    value: data?.expenseCount     ?? '—', change: 'this month',           up: true,  icon: '📄' },
    { label: 'Savings This Month',value: data?.savings          ?? '—', change: data?.savingsChange    ?? '—', up: true,  icon: '💰' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7ff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 36px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f1c3f', letterSpacing: '-0.02em', marginBottom: 4 }}>
              Dashboard
            </h1>
            <p style={{ fontSize: 14, color: '#8892b0' }}>
              Welcome back, <strong style={{ color: '#0f1c3f' }}>{user?.name || 'User'}</strong>! Here is your financial overview.
            </p>
          </div>
          <button style={{
            padding: '11px 22px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg,#1a6bff,#0d4fd9)',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxShadow: '0 4px 16px rgba(26,107,255,.3)',
          }}>
            + Add Expense
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#ef4444' }}>
            ⚠ Could not load dashboard data: {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: '#8892b0', fontSize: 14 }}>
            ⏳ Loading your data...
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
              {cards.map(c => <ExpenseCard key={c.label} {...c} />)}
            </div>

            {/* Chart */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '28px 28px 20px', border: '1px solid #e4e9f7', boxShadow: '0 2px 8px rgba(15,28,63,.05)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f1c3f', marginBottom: 24 }}>
                Monthly Spend Trend
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8892b0' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#8892b0' }} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e4e9f7', fontSize: 13 }} />
                  <Line type="monotone" dataKey="spent" stroke="#1a6bff" strokeWidth={2.5} dot={{ fill: '#1a6bff', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>
    </div>
  )
}