import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { busService, ticketService } from '../../services/api'
import { mockBuses, mockTickets } from '../../services/mockData'
import StatsCard from '../../components/admin/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'
import { formatTime } from '../../components/user/BusCard'
import { Bus, Ticket, Users, TrendingUp, Plus, Settings, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const [buses, setBuses]     = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [busRes, ticketRes] = await Promise.all([busService.getAll(), ticketService.getAll()])
        setBuses(busRes.data)
        setTickets(ticketRes.data)
      } catch {
        setBuses(mockBuses)
        setTickets(mockTickets)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const totalSeats   = buses.reduce((s, b) => s + (b.totalSeats || 0), 0)
  const bookedSeats  = buses.reduce((s, b) => s + (b.bookedSeats?.length || 0), 0)
  const occupancy    = totalSeats ? Math.round((bookedSeats / totalSeats) * 100) : 0

  return (
    <div className="page-container">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-sub">Overview of your SmartBus operations</p>
        </div>
        <Link to="/admin/add-bus" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={14} /> Add New Bus
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard icon={Bus}        label="Total Buses"        value={loading ? '…' : buses.length}   color="brand"   trend="+2 this week" />
        <StatsCard icon={Ticket}     label="Total Bookings"     value={loading ? '…' : tickets.length} color="emerald" trend="+12 today" />
        <StatsCard icon={Users}      label="Seats Booked"       value={loading ? '…' : bookedSeats}    color="amber" />
        <StatsCard icon={TrendingUp} label="Occupancy Rate"     value={loading ? '…' : `${occupancy}%`} color="rose" />
      </div>

      {/* Recent buses table */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white">Recent Buses</h2>
          <Link to="/admin/buses" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="table-header">Company</th>
                <th className="table-header">Route</th>
                <th className="table-header">Departure</th>
                <th className="table-header">Seats</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {(loading ? [] : buses.slice(0, 5)).map((bus) => (
                <tr key={bus._id} className="table-row">
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-white">{bus.company}</p>
                      <p className="text-xs text-slate-500">{bus.plateNumber}</p>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-white font-medium">{bus.from}</span>
                    <span className="text-slate-500 mx-1">→</span>
                    <span className="text-white font-medium">{bus.to}</span>
                  </td>
                  <td className="table-cell">{formatTime(bus.departureTime)}</td>
                  <td className="table-cell">
                    <span className="text-white">{bus.bookedSeats?.length || 0}</span>
                    <span className="text-slate-500">/{bus.totalSeats}</span>
                  </td>
                  <td className="table-cell"><StatusBadge status={bus.status} /></td>
                </tr>
              ))}
              {loading && (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500 text-sm">Loading…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/admin/add-bus"
          className="card group hover:border-brand-500/50 transition-all duration-300 flex items-center gap-4 cursor-pointer">
          <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
            <Plus size={20} className="text-brand-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Add New Bus</p>
            <p className="text-sm text-slate-500">Register a new bus to the system</p>
          </div>
          <ArrowRight size={16} className="text-slate-500 ml-auto group-hover:text-brand-400 transition-colors" />
        </Link>
        <Link to="/admin/buses"
          className="card group hover:border-brand-500/50 transition-all duration-300 flex items-center gap-4 cursor-pointer">
          <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
            <Settings size={20} className="text-brand-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Manage Buses</p>
            <p className="text-sm text-slate-500">Edit, update status, or remove buses</p>
          </div>
          <ArrowRight size={16} className="text-slate-500 ml-auto group-hover:text-brand-400 transition-colors" />
        </Link>
      </div>
    </div>
  )
}
