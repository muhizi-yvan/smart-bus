import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { busService } from '../../services/api'
import { CITIES } from '../../services/mockData'
import Alert from '../../components/common/Alert'
import { Bus, Plus } from 'lucide-react'

const FIELDS = [
  { name: 'company',       label: 'Company Name',    type: 'text',     placeholder: 'entre bus',     required: true },
  { name: 'plateNumber',   label: 'Plate Number',    type: 'text',     placeholder: 'plate no',           required: true },
  { name: 'departureTime', label: 'Departure Time',  type: 'datetime-local',                                    required: true },
  { name: 'totalSeats',    label: 'Total Seats',     type: 'number',   placeholder: '',                  required: true },
  { name: 'price',         label: 'Ticket Price (RWF)', type: 'number', placeholder: 'in rwf',              required: false },
]

const defaultForm = { company: '', plateNumber: '', from: '', to: '', departureTime: '', totalSeats: '', price: '', status: 'on time' }

export default function AddBusPage() {
  const navigate   = useNavigate()
  const [form, setForm]       = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.from === form.to) { setError('Origin and destination cannot be the same.'); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      await busService.create(form)
      setSuccess('Bus added successfully!')
      setForm(defaultForm)
      setTimeout(() => navigate('/admin/buses'), 1500)
    } catch (err) {
      if (!err.response) {
        // Demo: simulate success
        setSuccess('Bus added successfully! (Demo mode)')
        setForm(defaultForm)
        setTimeout(() => navigate('/admin/buses'), 1500)
        return
      }
      setError(err.response?.data?.message || 'Failed to add bus.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center">
            <Plus size={18} className="text-brand-400" />
          </div>
          <div>
            <h1 className="section-title mb-0">Add New Bus</h1>
            <p className="text-slate-500 text-sm">Register a new bus to the SmartBus network</p>
          </div>
        </div>

        <div className="card">
          {error   && <Alert type="error"   message={error}   onClose={() => setError('')}   />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Company & Plate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIELDS.slice(0, 2).map(({ name, label, type, placeholder, required }) => (
                <div key={name}>
                  <label className="label">{label} {required && <span className="text-rose-400">*</span>}</label>
                  <input name={name} type={type} required={required} placeholder={placeholder}
                    value={form[name]} onChange={handleChange} className="input" />
                </div>
              ))}
            </div>

            {/* From / To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">From <span className="text-rose-400">*</span></label>
                <select name="from" required value={form.from} onChange={handleChange} className="input">
                  <option value="">Select origin</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">To <span className="text-rose-400">*</span></label>
                <select name="to" required value={form.to} onChange={handleChange} className="input">
                  <option value="">Select destination</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Departure, Seats, Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {FIELDS.slice(2).map(({ name, label, type, placeholder, required }) => (
                <div key={name}>
                  <label className="label">{label} {required && <span className="text-rose-400">*</span>}</label>
                  <input name={name} type={type} required={required} placeholder={placeholder}
                    min={type === 'number' ? 1 : undefined}
                    value={form[name]} onChange={handleChange} className="input" />
                </div>
              ))}
            </div>

            {/* Status */}
            <div>
              <label className="label">Initial Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input">
                <option value="on time">On Time</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>

            {/* Preview */}
            {form.company && form.from && form.to && (
              <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-4 flex items-center gap-3">
                <Bus size={16} className="text-brand-400 shrink-0" />
                <p className="text-sm text-slate-300">
                  <span className="text-white font-semibold">{form.company}</span>
                  {' '}&middot; {form.from} → {form.to}
                  {form.totalSeats && <> &middot; {form.totalSeats} seats</>}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding…</>
                ) : (
                  <><Plus size={16} /> Add Bus</>
                )}
              </button>
              <button type="button" onClick={() => navigate('/admin/buses')} className="btn-secondary px-6">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
