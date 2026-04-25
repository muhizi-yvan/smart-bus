import { AlertCircle, CheckCircle2, X } from 'lucide-react'

export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null
  const isError = type === 'error'
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${
      isError
        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    } animate-fade-in`}>
      {isError ? <AlertCircle size={16} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={16} className="shrink-0 mt-0.5" />}
      <p className="text-sm flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="shrink-0 hover:opacity-70">
          <X size={14} />
        </button>
      )}
    </div>
  )
}
