'use client'
export default function ScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-500' : 'text-red-500'
  const ring = score >= 70 ? 'border-emerald-500' : score >= 40 ? 'border-amber-400' : 'border-red-500'
  return (
    <div className={`w-32 h-32 rounded-full border-4 ${ring} bg-surface-elevated flex items-center justify-center`}>
      <span className={`text-4xl font-bold ${color}`}>{score}</span>
    </div>
  )
}
