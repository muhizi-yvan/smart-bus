export default function LoadingSpinner({ fullPage = true, size = 'md' }) {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  const spinner = (
    <div className={`${sizeMap[size]} border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin`} />
  )
  if (!fullPage) return spinner
  return (
    <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {spinner}
        <p className="text-sm text-slate-400 font-medium">Loading…</p>
      </div>
    </div>
  )
}
