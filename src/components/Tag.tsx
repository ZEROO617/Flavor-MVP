export default function Tag({ children, variant = 'red' }: { children: React.ReactNode; variant?: 'red' | 'green' | 'blue' | 'amber' }) {
  const colors = {
    red: 'bg-red-50 text-red-600 border-red-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  }
  return <span className={`px-3 py-1 rounded-full text-xs border ${colors[variant]}`}>{children}</span>
}
