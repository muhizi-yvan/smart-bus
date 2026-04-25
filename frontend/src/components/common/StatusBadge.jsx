import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function StatusBadge({ status }) {
  const map = {
    'on time': { cls: 'badge-ontime',   Icon: CheckCircle2,  label: 'On Time'  },
    delayed:   { cls: 'badge-delayed',  Icon: AlertCircle,   label: 'Delayed'  },
    departed:  { cls: 'badge-departed', Icon: Clock,         label: 'Departed' },
  }
  const { cls, Icon, label } = map[status?.toLowerCase()] || map['on time']
  return (
    <span className={cls}>
      <Icon size={11} />
      {label}
    </span>
  )
}
