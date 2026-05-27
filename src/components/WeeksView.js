import { MATCH_WEEKS } from '../constants'

function fmt(val) { return `$${parseFloat(val || 0).toFixed(2)}` }

export default function WeeksView({ fines, setView }) {
  const summary = MATCH_WEEKS.map(w => {
    const wf = fines.filter(f => f.week === w)
    return {
      week: w,
      total: wf.reduce((s, f) => s + Number(f.amount), 0),
      unpaid: wf.filter(f => f.status === 'Unpaid').reduce((s, f) => s + Number(f.amount), 0),
      count: wf.length,
    }
  })

  return (
    <div className="week-grid">
      {summary.map(w => (
        <div key={w.week} className="week-card"
          style={{ background: w.count > 0 ? '#0d2040' : '#0b1a30', border: `1.5px solid ${w.count > 0 ? 'var(--blue)' : 'var(--line)'}` }}
          onClick={() => setView('register')}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--sky)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = w.count > 0 ? 'var(--blue)' : 'var(--line)'}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--muted)', letterSpacing: 1 }}>{w.week.toUpperCase()}</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 22, color: w.count > 0 ? 'var(--white)' : 'var(--line)', marginTop: 4 }}>{fmt(w.total)}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{w.count} fine{w.count !== 1 ? 's' : ''}</span>
            {w.unpaid > 0 && <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 600 }}>{fmt(w.unpaid)} owed</span>}
            {w.count > 0 && w.unpaid === 0 && <span style={{ fontSize: 11, color: 'var(--green)' }}>✓ clear</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
