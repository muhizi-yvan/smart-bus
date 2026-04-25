import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Bus, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import Alert from '../../components/common/Alert'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    if (form.password.length < 6)               { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen hero-gradient grid-overlay flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-glow">
              <Bus size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Smart<span className="text-brand-400">Bus</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 mt-2 text-sm">Start booking smarter today</p>
        </div>

        <div className="card">
          <Alert message={error} onClose={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="name" type="text" required
                  value={form.name} onChange={handleChange}
                  placeholder="John Doe" className="input pl-10" />
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="email" type="email" required
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className="input pl-10" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="password" type={showPw ? 'text' : 'password'} required
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="confirmPassword" type={showPw ? 'text' : 'password'} required
                  value={form.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter password" className="input pl-10" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
