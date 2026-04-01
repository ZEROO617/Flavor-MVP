'use client'
export default function ScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'
  const ring = score >= 70 ? 'border-emerald-400' : score >= 40 ? 'border-amber-400' : 'border-red-400'
  return (
    <div className={`w-32 h-32 rounded-full border-4 ${ring} flex items-center justify-center`}>
      <span className={`text-4xl font-bold ${color}`}>{score}</span>
    </div>
  )
}
