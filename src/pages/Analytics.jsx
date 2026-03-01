import React from 'react'
import Sidebar from '../components/Sidebar'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const data = [
  { name: 'Travel',    value: 3200 },
  { name: 'Food',      value: 1800 },
  { name: 'Software',  value: 2400 },
  { name: 'Office',    value: 900  },
  { name: 'Marketing', value: 1500 },
]
const COLORS = ['#1a6bff','#00d4ff','#00c9a7','#ffb347','#ff6b9d']

export default function Analytics() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7ff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 36px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f1c3f', letterSpacing: '-0.02em', marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 14, color: '#8892b0', marginBottom: 32 }}>Expense breakdown and trends</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #e4e9f7' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f1c3f', marginBottom: 20 }}>Spend by Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#8892b0' }} />
                <YAxis tick={{ fontSize: 12, fill: '#8892b0' }} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
                <Bar dataKey="value" radius={[6,6,0,0]}>
                  {data.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #e4e9f7' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f1c3f', marginBottom: 20 }}>Category Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                  {data.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  )
}