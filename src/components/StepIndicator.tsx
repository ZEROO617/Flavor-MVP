'use client'
const steps = ['분석', 'Lean Canvas', '로드맵']
export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
            ${i <= current ? 'bg-primary text-white' : 'bg-surface-elevated text-primary-subtle border border-surface-border'}`}>
            {i + 1}
          </div>
          <span className={`text-sm ${i <= current ? 'text-primary font-medium' : 'text-primary-subtle'}`}>{s}</span>
          {i < steps.length - 1 && <div className={`w-8 h-px ${i < current ? 'bg-primary/40' : 'bg-surface-border'}`} />}
        </div>
      ))}
    </div>
  )
}
