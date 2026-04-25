import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Bus, Menu, X, LogOut, Ticket, Home, LayoutDashboard, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const isActive = (path) => location.pathname === path

  const navLink = (to, label, Icon) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
        isActive(to) ? 'bg-brand-500/20 text-brand-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {Icon && <Icon size={15} />} {label}
    </Link>
  )

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-glow group-hover:bg-brand-400 transition-colors">
              <Bus size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              Smart<span className="text-brand-400">Bus</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              isAdmin ? (
                <>
                  {navLink('/admin', 'Dashboard', LayoutDashboard)}
                  {navLink('/admin/buses', 'Manage Buses', Bus)}
                  {navLink('/admin/add-bus', 'Add Bus', null)}
                </>
              ) : (
                <>
                  {navLink('/', 'Home', Home)}
                  {navLink('/buses', 'Find Buses', Bus)}
                  {navLink('/my-tickets', 'My Tickets', Ticket)}
                </>
              )
            ) : (
              <>
                {navLink('/', 'Home', Home)}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-sm font-medium text-slate-300 hover:border-brand-500 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-xs">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown size={14} className={`transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-card border border-surface-border rounded-xl shadow-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-surface-border">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      <span className={`text-xs ${isAdmin ? 'text-brand-400' : 'text-slate-400'}`}>
                        {isAdmin ? '⚡ Admin' : '🎫 Passenger'}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary py-2 px-4 text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-surface-border bg-surface-card px-4 py-4 space-y-1 animate-fade-in">
          {user ? (
            isAdmin ? (
              <>
                {navLink('/admin', 'Dashboard', LayoutDashboard)}
                {navLink('/admin/buses', 'Manage Buses', Bus)}
                {navLink('/admin/add-bus', 'Add Bus', null)}
              </>
            ) : (
              <>
                {navLink('/', 'Home', Home)}
                {navLink('/buses', 'Find Buses', Bus)}
                {navLink('/my-tickets', 'My Tickets', Ticket)}
              </>
            )
          ) : (
            <>
              {navLink('/', 'Home', Home)}
              <Link to="/login"    onClick={() => setOpen(false)} className="block mt-3 btn-secondary text-center text-sm">Sign In</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block mt-2 btn-primary  text-center text-sm">Get Started</Link>
            </>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
