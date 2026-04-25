export default function StatsCard({ icon: Icon, label, value, color = 'brand', trend }) {
  const colorMap = {
    brand:   'bg-brand-500/10 border-brand-500/20 text-brand-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber:   'bg-amber-500/10 border-amber-500/20 text-amber-400',
    rose:    'bg-rose-500/10 border-rose-500/20 text-rose-400',
  }
  return (
    <div className="card hover:border-brand-500/30 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-white font-display">{value ?? '—'}</p>
        <p className="text-sm text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  )
}
