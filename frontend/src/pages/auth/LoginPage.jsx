import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Bus, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Alert from '../../components/common/Alert'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form)
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Demo fill
  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@smartbus.rw', password: 'admin123' })
    else                  setForm({ email: 'user@smartbus.rw',  password: 'user123'  })
  }

  return (
    <div className="min-h-screen hero-gradient grid-overlay flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-glow">
              <Bus size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Smart<span className="text-brand-400">Bus</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-2 text-sm">Sign in to continue your journey</p>
        </div>

        <div className="card">
          {/* Demo buttons */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => fillDemo('user')}  className="flex-1 text-xs py-2 px-3 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 hover:bg-brand-500/20 transition-colors">
              Demo: Passenger
            </button>
            <button onClick={() => fillDemo('admin')} className="flex-1 text-xs py-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors">
              Demo: Admin
            </button>
          </div>

          <Alert message={error} onClose={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="email" type="email" required
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="password" type={showPw ? 'text' : 'password'} required
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                />
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            No account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
