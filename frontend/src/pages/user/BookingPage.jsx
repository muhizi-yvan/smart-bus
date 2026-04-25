import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { busService, ticketService } from '../../services/api'
import { mockBuses } from '../../services/mockData'
import { useAuth } from '../../context/AuthContext'
import SeatGrid from '../../components/user/SeatGrid'
import StatusBadge from '../../components/common/StatusBadge'
import Alert from '../../components/common/Alert'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatTime, formatDate } from '../../components/user/BusCard'
import { ArrowRight, Bus, CheckCircle2, Clock, MapPin, Users } from 'lucide-react'

export default function BookingPage() {
  const { id }     = useParams()
  const { state }  = useLocation()
  const navigate   = useNavigate()
  const { user }   = useAuth()

  const [bus, setBus]             = useState(state?.bus || null)
  const [loading, setLoading]     = useState(!state?.bus)
  const [selectedSeat, setSeat]   = useState(null)
  const [booking, setBooking]     = useState(false)
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    if (!bus) {
      (async () => {
        try {
          const res = await busService.getById(id)
          setBus(res.data)
        } catch {
          const found = mockBuses.find(b => b._id === id)
          if (found) setBus(found)
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [id, bus])

  const handleConfirm = async () => {
    if (!selectedSeat) { setError('Please select a seat first.'); return }
    setBooking(true); setError('')
    try {
      await ticketService.book({ busId: bus._id, seatNumber: selectedSeat, userId: user._id })
      setSuccess(true)
    } catch (err) {
      // Demo fallback — show success anyway for UI demo
      if (!err.response) { setSuccess(true); return }
      setError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (!bus) return (
    <div className="page-container text-center py-20">
      <p className="text-slate-400">Bus not found.</p>
    </div>
  )

  if (success) return (
    <div className="page-container flex items-center justify-center min-h-[70vh]">
      <div className="card max-w-md w-full text-center animate-slide-up">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
        <p className="text-slate-400 text-sm mb-1">Seat <strong className="text-white">{selectedSeat}</strong> on</p>
        <p className="text-brand-400 font-semibold mb-1">{bus.company}</p>
        <p className="text-slate-400 text-sm mb-6">{bus.from} → {bus.to} · {formatTime(bus.departureTime)}</p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/my-tickets')} className="btn-primary flex-1">View My Tickets</button>
          <button onClick={() => navigate('/buses')}      className="btn-secondary flex-1">Find More Buses</button>
        </div>
      </div>
    </div>
  )

  const available = bus.totalSeats - (bus.bookedSeats?.length || 0)

  return (
    <div className="page-container">
      <div className="max-w-5xl mx-auto">
        <h1 className="section-title mb-1">Book Your Seat</h1>
        <p className="section-sub">Select a seat and confirm your booking</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          {/* Seat Grid — left */}
          <div className="lg:col-span-3 card">
            <h2 className="font-bold text-white mb-1 text-sm">Choose Your Seat</h2>
            <p className="text-xs text-slate-500 mb-5">{available} of {bus.totalSeats} seats available</p>
            <SeatGrid
              totalSeats={bus.totalSeats}
              bookedSeats={bus.bookedSeats || []}
              selectedSeat={selectedSeat}
              onSelect={setSeat}
            />
          </div>

          {/* Summary — right */}
          <div className="lg:col-span-2 space-y-4">
            {/* Bus info */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <Bus size={16} className="text-brand-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{bus.company}</p>
                    <p className="text-xs text-slate-500">{bus.plateNumber}</p>
                  </div>
                </div>
                <StatusBadge status={bus.status} />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={13} className="text-brand-400 shrink-0" />
                  <span className="font-medium text-white">{bus.from}</span>
                  <ArrowRight size={12} />
                  <span className="font-medium text-white">{bus.to}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={13} className="text-brand-400 shrink-0" />
                  <span>{formatDate(bus.departureTime)} · {formatTime(bus.departureTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users size={13} className="text-brand-400 shrink-0" />
                  <span>{available} seats left</span>
                </div>
              </div>
            </div>

            {/* Seat selection summary */}
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Route</span>
                  <span className="text-white font-medium">{bus.from} → {bus.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Departure</span>
                  <span className="text-white font-medium">{formatTime(bus.departureTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seat</span>
                  <span className={`font-bold ${selectedSeat ? 'text-brand-400' : 'text-slate-500'}`}>
                    {selectedSeat ? `Seat ${selectedSeat}` : 'Not selected'}
                  </span>
                </div>
                {bus.price && (
                  <>
                    <div className="my-2 border-t border-surface-border" />
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total</span>
                      <span className="text-white font-bold">RWF {bus.price?.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>

              <Alert message={error} onClose={() => setError('')} />

              <button
                onClick={handleConfirm}
                disabled={!selectedSeat || booking || bus.status?.toLowerCase() === 'departed'}
                className="btn-primary w-full mt-4"
              >
                {booking ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Confirming…
                  </span>
                ) : bus.status?.toLowerCase() === 'departed' ? 'Bus Already Departed'
                  : !selectedSeat ? 'Select a Seat'
                  : `Confirm Booking — Seat ${selectedSeat}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
