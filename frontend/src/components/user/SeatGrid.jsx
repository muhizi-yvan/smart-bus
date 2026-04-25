export default function SeatGrid({ totalSeats, bookedSeats = [], selectedSeat, onSelect }) {
  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-6 mb-6 text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-surface-card border border-surface-border inline-block" />
          Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-brand-500 inline-block" />
          Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-surface-border/50 border border-surface-border inline-block" />
          Booked
        </span>
      </div>

      {/* Driver area */}
      <div className="flex justify-end mb-4">
        <div className="bg-surface-card border border-surface-border rounded-lg px-4 py-2 text-xs text-slate-500 flex items-center gap-2">
          🚌 Driver
        </div>
      </div>

      {/* Seat grid — 4 columns (2+aisle+2) */}
      <div className="space-y-2">
        {Array.from({ length: Math.ceil(totalSeats / 4) }, (_, row) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-5 text-xs text-slate-600 text-right shrink-0">{row + 1}</span>
            <div className="flex gap-2">
              {[0, 1].map((col) => {
                const seatNum = row * 4 + col + 1
                if (seatNum > totalSeats) return <div key={col} className="w-10 h-10" />
                const isBooked   = bookedSeats.includes(seatNum)
                const isSelected = selectedSeat === seatNum
                return (
                  <button
                    key={col}
                    disabled={isBooked}
                    onClick={() => !isBooked && onSelect(isSelected ? null : seatNum)}
                    className={`seat ${isBooked ? 'seat-booked' : isSelected ? 'seat-selected' : 'seat-available'}`}
                    title={isBooked ? 'Booked' : `Seat ${seatNum}`}
                  >
                    {seatNum}
                  </button>
                )
              })}
            </div>
            {/* Aisle */}
            <div className="w-6 flex items-center justify-center">
              <div className="h-px w-full border-dashed border-t border-surface-border" />
            </div>
            <div className="flex gap-2">
              {[2, 3].map((col) => {
                const seatNum = row * 4 + col + 1
                if (seatNum > totalSeats) return <div key={col} className="w-10 h-10" />
                const isBooked   = bookedSeats.includes(seatNum)
                const isSelected = selectedSeat === seatNum
                return (
                  <button
                    key={col}
                    disabled={isBooked}
                    onClick={() => !isBooked && onSelect(isSelected ? null : seatNum)}
                    className={`seat ${isBooked ? 'seat-booked' : isSelected ? 'seat-selected' : 'seat-available'}`}
                    title={isBooked ? 'Booked' : `Seat ${seatNum}`}
                  >
                    {seatNum}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
