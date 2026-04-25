import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Bus, MapPin, Calendar, ArrowRight, Shield, Zap, Star, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { CITIES } from '../../services/mockData'

export default function HomePage() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [search, setSearch] = useState({ from: '', to: '', date: '' })

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.from) params.set('from', search.from)
    if (search.to)   params.set('to',   search.to)
    if (search.date) params.set('date',  search.date)
    navigate(`/buses?${params.toString()}`)
  }

  const features = [
    { icon: Zap,    title: 'Instant Booking',   desc: 'Reserve your seat in under 60 seconds with real-time availability.' },
    { icon: Shield, title: 'Safe & Secure',      desc: 'Your payments and data are protected with industry-grade encryption.' },
    { icon: Star,   title: 'Top-Rated Coaches',  desc: 'Travel with verified, highly-rated bus companies across the country.' },
    { icon: Users,  title: 'Track Your Ride',    desc: 'Live status updates so you always know if your bus is on time.' },
  ]

  const popularRoutes = [
    { from: 'Kigali', to: 'Musanze',  price: 'RWF 2,500', duration: '2h 30m' },
    { from: 'Kigali', to: 'Rubavu',   price: 'RWF 4,000', duration: '3h 00m' },
    { from: 'Kigali', to: 'Huye',     price: 'RWF 3,000', duration: '2h 00m' },
    { from: 'Kigali', to: 'Nyagatare',price: 'RWF 3,500', duration: '2h 45m' },
    { from: 'Kigali', to: 'Kayonza',  price: 'RWF 2,500', duration: '2h 30m' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative hero-gradient grid-overlay overflow-hidden">
        {/* Decorative orb */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="page-container relative py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-brand-400 text-xs font-semibold mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
              Rwanda's Smartest Bus Platform
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-slide-up font-display">
              Travel Smarter,<br />
              <span className="text-brand-400">Every Journey.</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.15s' }}>
              Book intercity bus tickets instantly. Choose your seat, track your ride, and arrive on time — every time.
            </p>

            {/* Search Card */}
            <div className="card text-left animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label flex items-center gap-1.5">
                      <MapPin size={12} className="text-brand-400" /> From
                    </label>
                    <select
                      value={search.from}
                      onChange={(e) => setSearch({ ...search, from: e.target.value })}
                      className="input"
                    >
                      <option value="">Any city</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label flex items-center gap-1.5">
                      <MapPin size={12} className="text-brand-400" /> To
                    </label>
                    <select
                      value={search.to}
                      onChange={(e) => setSearch({ ...search, to: e.target.value })}
                      className="input"
                    >
                      <option value="">Any city</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label flex items-center gap-1.5">
                      <Calendar size={12} className="text-brand-400" /> Date
                    </label>
                    <input
                      type="date"
                      value={search.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSearch({ ...search, date: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                  <Bus size={16} /> Search Buses <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-surface-border bg-surface-card">
        <div className="page-container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { v: '50+',    l: 'Bus Companies'   },
              { v: '200+',   l: 'Daily Routes'    },
              { v: '10K+',   l: 'Happy Passengers'},
              { v: '99.2%',  l: 'On-time Rate'    },
            ].map(({ v, l }) => (
              <div key={l}>
                <p className="text-2xl font-bold text-white font-display">{v}</p>
                <p className="text-xs text-slate-500 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Routes */}
      <section className="page-container py-16">
        <h2 className="section-title">Popular Routes</h2>
        <p className="section-sub">Frequently booked intercity connections</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularRoutes.map((r) => (
            <Link
              key={r.to}
              to={`/buses?from=${r.from}&to=${r.to}`}
              className="card group hover:border-brand-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:shadow-glow/30"
            >
              <div className="flex items-center justify-between mb-3">
                <Bus size={16} className="text-brand-400" />
                <span className="text-xs text-slate-500">{r.duration}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-white">{r.from}</span>
                <ArrowRight size={14} className="text-brand-400 shrink-0" />
                <span className="font-bold text-white">{r.to}</span>
              </div>
              <p className="text-brand-400 font-semibold text-sm">{r.price}</p>
              <p className="text-xs text-slate-500 mt-1 group-hover:text-brand-400 transition-colors">View schedules →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface-card/50 border-y border-surface-border">
        <div className="page-container py-16">
          <h2 className="section-title text-center">Why SmartBus?</h2>
          <p className="section-sub text-center mb-10">Built for modern travelers who value time and comfort</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group text-center p-6 rounded-2xl border border-surface-border hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-300">
                <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-500/20 transition-colors">
                  <Icon size={20} className="text-brand-400" />
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="page-container py-16 text-center">
          <div className="max-w-xl mx-auto card bg-gradient-to-br from-brand-900/60 to-surface-card border-brand-500/30">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to travel?</h2>
            <p className="text-slate-400 text-sm mb-6">Create your free account and book your first trip in minutes.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/register" className="btn-primary">Get Started Free</Link>
              <Link to="/login"    className="btn-secondary">Sign In</Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-surface-border">
        <div className="page-container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
              <Bus size={12} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">Smart<span className="text-brand-400">Bus</span></span>
          </div>
          <p className="text-slate-600 text-xs">© 2025 SmartBus Rwanda. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
