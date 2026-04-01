'use client'
const steps = ['분석', 'Lean Canvas', '로드맵']
export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${i <= current ? 'bg-brand text-white' : 'bg-surface-hover text-gray-400'}`}>
            {i + 1}
          </div>
          <span className={`text-sm ${i <= current ? 'text-white' : 'text-gray-500'}`}>{s}</span>
          {i < steps.length - 1 && <div className={`w-8 h-px ${i < current ? 'bg-brand' : 'bg-surface-hover'}`} />}
        </div>
      ))}
    </div>
  )
}
