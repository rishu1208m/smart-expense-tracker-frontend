import React from 'react'

export default function ExpenseCard({ label, value, change, up, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e4e9f7] shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
        }`}>
          {up ? '▲' : '▼'} {change}
        </span>
      </div>
      <div className="text-2xl font-extrabold text-[#0f1c3f] tracking-tight">{value}</div>
      <div className="text-xs text-[#8892b0] mt-1 font-medium uppercase tracking-wider">{label}</div>
    </div>
  )
}