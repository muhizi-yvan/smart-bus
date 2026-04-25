import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { busService } from '../../services/api'
import { mockBuses, CITIES } from '../../services/mockData'
import StatusBadge from '../../components/common/StatusBadge'
import Alert from '../../components/common/Alert'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatTime, formatDate } from '../../components/user/BusCard'
import { Bus, Edit2, Trash2, RefreshCw, Plus, X, Check } from 'lucide-react'

export default function ManageBusesPage() {
  const [buses, setBuses]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm]   = useState({})
  const [deletingId, setDel]      = useState(null)
  const [statusModal, setStatusModal] = useState(null) // { bus }

  const fetchBuses = async () => {
    setLoading(true)
    try {
      const res = await busService.getAll()
      setBuses(res.data)
    } catch {
      setBuses(mockBuses)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBuses() }, [])

  // --- Edit ---
  const startEdit = (bus) => { setEditingId(bus._id); setEditForm({ ...bus }) }
  const cancelEdit = () => { setEditingId(null); setEditForm({}) }

  const saveEdit = async () => {
    try {
      await busService.update(editingId, editForm)
      setSuccess('Bus updated successfully.')
      fetchBuses()
    } catch {
      setBuses(prev => prev.map(b => b._id === editingId ? { ...b, ...editForm } : b))
      setSuccess('Bus updated. (Demo mode)')
    }
    setEditingId(null)
  }

  // --- Delete ---
  const confirmDelete = async (id) => {
    try {
      await busService.delete(id)
    } catch { /* demo */ }
    setBuses(prev => prev.filter(b => b._id !== id))
    setSuccess('Bus removed.')
    setDel(null)
  }

  // --- Status ---
  const updateStatus = async (bus, status) => {
    try {
      await busService.updateStatus(bus._id, status)
    } catch { /* demo */ }
    setBuses(prev => prev.map(b => b._id === bus._id ? { ...b, status } : b))
    setStatusModal(null)
    setSuccess(`Status updated to "${status}".`)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title flex items-center gap-2"><Bus size={22} /> Manage Buses</h1>
          <p className="section-sub">Edit, update status, or remove buses from the system</p>
        </div>
        <Link to="/admin/add-bus" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={14} /> Add Bus
        </Link>
      </div>

      {error   && <Alert type="error"   message={error}   onClose={() => setError('')}   />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card overflow-x-auto mt-6">
        <table className="w-full min-w-[750px]">
          <thead>
            <tr className="border-b border-surface-border">
              {['Company / Plate', 'Route', 'Departure', 'Seats', 'Status', 'Actions'].map(h => (
                <th key={h} className="table-header">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus._id} className="table-row">
                <td className="table-cell">
                  {editingId === bus._id ? (
                    <div className="space-y-1">
                      <input value={editForm.company} onChange={e => setEditForm({ ...editForm, company: e.target.value })}
                        className="input text-xs py-1.5 px-2" placeholder="Company" />
                      <input value={editForm.plateNumber} onChange={e => setEditForm({ ...editForm, plateNumber: e.target.value })}
                        className="input text-xs py-1.5 px-2" placeholder="Plate" />
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-white">{bus.company}</p>
                      <p className="text-xs text-slate-500">{bus.plateNumber}</p>
                    </div>
                  )}
                </td>
                <td className="table-cell">
                  {editingId === bus._id ? (
                    <div className="flex items-center gap-1">
                      <select value={editForm.from} onChange={e => setEditForm({ ...editForm, from: e.target.value })}
                        className="input text-xs py-1.5 px-2 w-24">
                        {CITIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <span className="text-slate-500">→</span>
                      <select value={editForm.to} onChange={e => setEditForm({ ...editForm, to: e.target.value })}
                        className="input text-xs py-1.5 px-2 w-24">
                        {CITIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  ) : (
                    <span className="text-slate-300">
                      <span className="text-white">{bus.from}</span>
                      <span className="text-slate-500 mx-1">→</span>
                      <span className="text-white">{bus.to}</span>
                    </span>
                  )}
                </td>
                <td className="table-cell">
                  {editingId === bus._id ? (
                    <input type="datetime-local" value={editForm.departureTime?.slice(0, 16)}
                      onChange={e => setEditForm({ ...editForm, departureTime: e.target.value })}
                      className="input text-xs py-1.5 px-2" />
                  ) : (
                    <div>
                      <p className="text-white">{formatTime(bus.departureTime)}</p>
                      <p className="text-xs text-slate-500">{formatDate(bus.departureTime)}</p>
                    </div>
                  )}
                </td>
                <td className="table-cell">
                  <span className="text-white">{bus.bookedSeats?.length || 0}</span>
                  <span className="text-slate-500">/{bus.totalSeats}</span>
                </td>
                <td className="table-cell"><StatusBadge status={bus.status} /></td>
                <td className="table-cell">
                  {editingId === bus._id ? (
                    <div className="flex gap-2">
                      <button onClick={saveEdit}   className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"><Check size={14} /></button>
                      <button onClick={cancelEdit}  className="p-1.5 rounded-lg bg-surface-border text-slate-400 hover:bg-surface-border/80 transition-colors"><X size={14} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(bus)}
                        className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setStatusModal(bus)}
                        className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors" title="Update Status">
                        <RefreshCw size={14} />
                      </button>
                      <button onClick={() => setDel(bus._id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {buses.length === 0 && (
          <div className="text-center py-12">
            <Bus size={28} className="text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No buses found. <Link to="/admin/add-bus" className="text-brand-400">Add one →</Link></p>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="card max-w-sm w-full animate-slide-up">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-center mb-4">
              <Trash2 size={20} className="text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Bus</h3>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone. The bus and all its data will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => confirmDelete(deletingId)} className="btn-danger flex-1">Yes, Delete</button>
              <button onClick={() => setDel(null)}              className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Status modal */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="card max-w-sm w-full animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center">
                <RefreshCw size={16} className="text-brand-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Update Status</h3>
                <p className="text-xs text-slate-500">{statusModal.company} · {statusModal.from} → {statusModal.to}</p>
              </div>
            </div>
            <div className="space-y-2">
              {['on time', 'delayed', 'departed'].map(s => (
                <button key={s} onClick={() => updateStatus(statusModal, s)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                    statusModal.status === s
                      ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                      : 'border-surface-border bg-surface-card text-slate-400 hover:border-brand-500/50'
                  }`}>
                  {s === 'on time' ? '✅ On Time' : s === 'delayed' ? '⚠️ Delayed' : '🚌 Departed'}
                </button>
              ))}
            </div>
            <button onClick={() => setStatusModal(null)} className="btn-secondary w-full mt-4">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
