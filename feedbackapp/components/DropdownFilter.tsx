'use client'

import { useState, useRef, useEffect } from 'react'
import { Filter, ChevronDown } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface DropdownFilterProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
}

export default function DropdownFilter({ value, onChange, options }: DropdownFilterProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find((o) => o.value === value)
  const displayLabel = selected?.label ?? 'Todos'

  return (
    <div className="relative" ref={ref}>
      <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d62a5] pointer-events-none" />
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full min-w-[180px] pl-10 pr-8 py-3 bg-[#271033] border border-[#8d62a5] rounded-lg text-[#fbdaf9] text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#f500f1] transition-all duration-200"
      >
        {displayLabel}
      </button>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d62a5] pointer-events-none" />
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#271033] border border-[#8d62a5] rounded-lg overflow-hidden shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                opt.value === value
                  ? 'bg-[#f500f1] text-white font-medium'
                  : 'text-[#fbdaf9] hover:bg-[#3a1f52]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
