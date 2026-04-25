import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { busService } from '../../services/api'
import { mockBuses, CITIES } from '../../services/mockData'
import BusCard from '../../components/user/BusCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Bus, Filter, Search, X } from 'lucide-react'

export default function BusListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [buses, setBuses]     = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    from: searchParams.get('from') || '',
    to:   searchParams.get('to')   || '',
    date: searchParams.get('date') || '',
    status: '',
  })

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true)
      try {
        const res = await busService.getAll({ from: filters.from, to: filters.to, date: filters.date })
        setBuses(res.data)
      } catch {
        // Demo fallback
        let data = [...mockBuses]
        if (filters.from)   data = data.filter(b => b.from.toLowerCase().includes(filters.from.toLowerCase()))
        if (filters.to)     data = data.filter(b => b.to.toLowerCase().includes(filters.to.toLowerCase()))
        if (filters.status) data = data.filter(b => b.status === filters.status)
        setBuses(data)
      } finally {
        setLoading(false)
      }
    }
    fetchBuses()
  }, [filters.from, filters.to, filters.date, filters.status])

  const applyFilter = (key, value) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    const p = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => v && p.set(k, v))
    setSearchParams(p)
  }

  const clearFilters = () => {
    setFilters({ from: '', to: '', date: '', status: '' })
    setSearchParams({})
  }

  const hasFilters = filters.from || filters.to || filters.date || filters.status

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-2"><Bus size={22} /> Available Buses</h1>
        <p className="section-sub">Browse and book seats on available routes</p>
      </div>

      {/* Filter bar */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="label">From</label>
            <select value={filters.from} onChange={e => applyFilter('from', e.target.value)} className="input">
              <option value="">All cities</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">To</label>
            <select value={filters.to} onChange={e => applyFilter('to', e.target.value)} className="input">
              <option value="">All cities</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" value={filters.date}
              onChange={e => applyFilter('date', e.target.value)}
              className="input" />
          </div>
          <div>
            <label className="label">Status</label>
            <select value={filters.status} onChange={e => applyFilter('status', e.target.value)} className="input">
              <option value="">All statuses</option>
              <option value="on time">On Time</option>
              <option value="delayed">Delayed</option>
              <option value="departed">Departed</option>
            </select>
          </div>
          <div className="flex items-end">
            {hasFilters ? (
              <button onClick={clearFilters} className="btn-secondary w-full flex items-center justify-center gap-2">
                <X size={14} /> Clear
              </button>
            ) : (
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <Search size={14} /> Search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner fullPage={false} />
      ) : buses.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-surface-card border border-surface-border rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bus size={28} className="text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No buses found</h3>
          <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search a different route.</p>
          <button onClick={clearFilters} className="btn-secondary inline-flex items-center gap-2">
            <Filter size={14} /> Clear Filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-400 mb-4">
            Showing <span className="text-white font-medium">{buses.length}</span> {buses.length === 1 ? 'bus' : 'buses'}
            {filters.from && <> from <span className="text-white font-medium">{filters.from}</span></>}
            {filters.to   && <> to <span className="text-white font-medium">{filters.to}</span></>}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {buses.map((bus, i) => (
              <div key={bus._id} className="animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <BusCard bus={bus} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
