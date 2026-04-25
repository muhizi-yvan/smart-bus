import { Link } from 'react-router-dom'
import { Clock, Users, ArrowRight, Building2 } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

export function formatTime(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}
export function formatDate(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function BusCard({ bus }) {
  const available = bus.totalSeats - (bus.bookedSeats?.length || 0)
  const departed  = bus.status?.toLowerCase() === 'departed'

  return (
    <div className={`card group hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow/50 ${departed ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <Building2 size={18} className="text-brand-400" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{bus.company}</p>
            <p className="text-xs text-slate-500">{bus.plateNumber}</p>
          </div>
        </div>
        <StatusBadge status={bus.status} />
      </div>

      {/* Route */}
      <div className="flex items-center gap-3 my-4">
        <div className="text-center">
          <p className="text-xl font-bold text-white font-display">{bus.from}</p>
          <p className="text-xs text-slate-500">{formatDate(bus.departureTime)}</p>
        </div>
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-px bg-surface-border" />
          <div className="flex flex-col items-center">
            <ArrowRight size={16} className="text-brand-400" />
            <span className="text-xs text-slate-500 mt-0.5">{formatTime(bus.departureTime)}</span>
          </div>
          <div className="flex-1 h-px bg-surface-border" />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white font-display">{bus.to}</p>
          <p className="text-xs text-slate-500">Arrival TBD</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Clock size={13} />
            <span>{formatTime(bus.departureTime)}</span>
          </div>
          <div className={`flex items-center gap-1.5 text-sm ${available < 5 ? 'text-amber-400' : 'text-slate-400'}`}>
            <Users size={13} />
            <span>{available} seats left</span>
          </div>
        </div>
        {!departed ? (
          <Link
            to={`/book/${bus._id}`}
            state={{ bus }}
            className="btn-primary py-2 px-4 text-sm inline-flex items-center gap-1.5"
          >
            Book Now <ArrowRight size={14} />
          </Link>
        ) : (
          <span className="text-xs text-slate-500 bg-surface-border/50 px-3 py-1.5 rounded-lg">
            Departed
          </span>
        )}
      </div>
    </div>
  )
}
