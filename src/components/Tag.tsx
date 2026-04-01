export default function Tag({ children, variant = 'red' }: { children: React.ReactNode; variant?: 'red' | 'green' | 'blue' | 'amber' }) {
  const colors = {
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  }
  return <span className={`px-3 py-1 rounded-full text-xs border ${colors[variant]}`}>{children}</span>
}
