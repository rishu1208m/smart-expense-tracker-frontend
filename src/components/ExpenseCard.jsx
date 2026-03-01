import React from 'react'

export default function ExpenseCard({ label, value, change, up, icon }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '20px',
      border: '1px solid #e4e9f7', boxShadow: '0 2px 8px rgba(15,28,63,.05)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ fontSize: 26 }}>{icon}</span>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '4px 8px', borderRadius: 20,
          background: up ? '#ecfdf5' : '#fef2f2',
          color: up ? '#059669' : '#ef4444',
        }}>
          {up ? '▲' : '▼'} {change}
        </span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#0f1c3f', letterSpacing: '-0.02em', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#8892b0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
    </div>
  )
}