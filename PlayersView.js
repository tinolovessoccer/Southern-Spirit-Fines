function fmt(val) { return `$${parseFloat(val || 0).toFixed(2)}` }

export default function PlayersView({ fines, players }) {
  const summary = players.map(p => {
    const pf = fines.filter(f => f.player === p)
    return {
      name: p,
      total: pf.reduce((s, f) => s + Number(f.amount), 0),
      unpaid: pf.filter(f => f.status === 'Unpaid').reduce((s, f) => s + Number(f.amount), 0),
      count: pf.length,
      fines: pf,
    }
  }).sort((a, b) => b.unpaid - a.unpaid)

  return (
    <div className="player-grid">
      {summary.map(p => (
        <div key={p.name} className="player-card" style={{ border: `1.5px solid ${p.unpaid > 0 ? '#e8404033' : 'var(--line)'}` }}>
          <div className="player-card-header">
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{p.count} fine{p.count !== 1 ? 's' : ''} issued</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {p.unpaid > 0 && (
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--red)' }}>
                  {fmt(p.unpaid)} <span style={{ fontSize: 11, fontFamily: "'Barlow', sans-serif", fontWeight: 400 }}>owed</span>
                </div>
              )}
              {p.unpaid === 0 && p.total > 0 && <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>✓ All paid</div>}
              {p.total === 0 && <div style={{ fontSize: 12, color: 'var(--muted)' }}>Clean</div>}
            </div>
          </div>
          {p.fines.length > 0 && (
            <div className="player-tags">
              {p.fines.slice(0, 6).map(f => (
                <span key={f.id} className="player-tag" style={{
                  background: f.status === 'Paid' ? '#1ec97a18' : '#e8404018',
                  color: f.status === 'Paid' ? 'var(--green)' : '#ff7070',
                  border: `1px solid ${f.status === 'Paid' ? '#1ec97a33' : '#e8404033'}`
                }}>
                  {f.week} · {fmt(f.amount)}
                </span>
              ))}
              {p.fines.length > 6 && <span style={{ fontSize: 10, color: 'var(--muted)' }}>+{p.fines.length - 6} more</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
