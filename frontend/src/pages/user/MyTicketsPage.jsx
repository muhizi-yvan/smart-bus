import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ticketService } from '../../services/api'
import { mockTickets } from '../../services/mockData'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import { formatTime, formatDate } from '../../components/user/BusCard'
import { Ticket, ArrowRight, Bus, Calendar, Hash } from 'lucide-react'

export default function MyTicketsPage() {
  const { user }          = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await ticketService.getUserTickets(user._id)
        setTickets(res.data)
      } catch {
        setTickets(mockTickets)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [user._id])

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title flex items-center gap-2"><Ticket size={22} /> My Tickets</h1>
          <p className="section-sub">Your booking history and upcoming trips</p>
        </div>
        <Link to="/buses" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Bus size={14} /> Book New Trip
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-surface-card border border-surface-border rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Ticket size={28} className="text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No tickets yet</h3>
          <p className="text-slate-500 text-sm mb-6">Your booked trips will appear here once you make a booking.</p>
          <Link to="/buses" className="btn-primary inline-flex items-center gap-2">
            <Bus size={14} /> Browse Buses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket, i) => {
            const bus = ticket.bus || {}
            return (
              <div
                key={ticket._id}
                className="card hover:border-brand-500/30 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left — Route */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center shrink-0">
                      <Bus size={20} className="text-brand-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-0.5">{bus.company || 'Bus Company'}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                        <span className="font-medium">{bus.from}</span>
                        <ArrowRight size={12} className="text-brand-400" />
                        <span className="font-medium">{bus.to}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {formatDate(bus.departureTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ArrowRight size={11} /> {formatTime(bus.departureTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash size={11} /> Seat {ticket.seatNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right — Status */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
                    <StatusBadge status={ticket.status === 'confirmed' ? 'on time' : ticket.status} />
                    <span className="text-xs text-slate-600">
                      Booked {formatDate(ticket.bookedAt)}
                    </span>
                  </div>
                </div>

                {/* Ticket strip */}
                <div className="mt-4 pt-4 border-t border-dashed border-surface-border flex items-center justify-between">
                  <div className="flex items-center gap-6 text-xs text-slate-500">
                    <span>Ticket ID: <span className="text-slate-400 font-mono">{ticket._id}</span></span>
                  </div>
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    ticket.status === 'confirmed'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {ticket.status?.toUpperCase() || 'CONFIRMED'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
