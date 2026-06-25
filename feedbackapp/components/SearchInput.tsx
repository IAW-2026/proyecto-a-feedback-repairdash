'use client'

import { Search } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchInput({ value, onChange, placeholder = 'Buscar...' }: SearchInputProps) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-accent-soft" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-brand-bg border border-brand-accent-soft rounded-lg text-brand-text-light placeholder-brand-accent-soft/50 focus:outline-none focus:ring-2 focus:ring-brand-accent-strong transition-all duration-200"
      />
    </div>
  )
}
