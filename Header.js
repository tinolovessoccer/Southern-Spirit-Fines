import logo from '../logo.jpeg'

function fmt(val) { return `$${parseFloat(val || 0).toFixed(2)}` }

function TreasuryCircle({ collected, total }) {
  const pct = total > 0 ? Math.min(collected / total, 1) : 0
  const r = 38
  const circ = 2 * Math.PI * r
  const dash = pct * circ
  const color = pct >= 0.75 ? 'var(--green)' : pct >= 0.4 ? 'var(--sky)' : 'var(--red)'

  return (
    <div className="treasury">
      <div style={{ position: 'relative', width: 88, height: 88 }}>
        <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="44" cy="44" r={r} fill="none" stroke="#1e3a5f" strokeWidth="7" />
          <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease, stroke 0.4s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14, color, lineHeight: 1 }}>{Math.round(pct * 100)}%</div>
          <div style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: 1, marginTop: 2 }}>PAID</div>
        </div>
      </div>
      <div style={{ marginTop: 8, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--green)' }}>{fmt(collected)}</div>
        <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 1 }}>of {fmt(total)} collected</div>
      </div>
    </div>
  )
}

export default function Header({
  isAdmin, session, totalAll, totalPaid, totalUnpaid, finesCount,
  view, setView, onIssue, onPayment, onLogin, onLogout, onFinesList, onRoster
}) {
  return (
    <div className="header">
      <div className="header-top">
        <div className="header-brand">
          <img src={logo} alt="Southern Spirit FC" style={{ width: 58, height: 58, objectFit: 'contain', filter: 'drop-shadow(0 0 8px #1a5cbc66)' }} />
          <div>
            <div className="header-title">SOUTHERN SPIRIT</div>
            <div className="header-sub">FINE REGISTER · 2025 SEASON</div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-sky" onClick={onPayment}>💳 Pay</button>
          {isAdmin ? (
            <>
              <button className="btn admin-unlocked" onClick={onLogout}>🔓 {session?.user?.email?.split('@')[0]}</button>
              <button className="btn btn-primary" onClick={onIssue}>+ Issue Fine</button>
            </>
          ) : (
            <button className="btn admin-locked" onClick={onLogin}>🔒 Admin Login</button>
          )}
        </div>
      </div>

      <div className="stats-row">
        <TreasuryCircle collected={totalPaid} total={totalAll} />
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
          {[
            { label: 'Total Issued',  value: fmt(totalAll),    unit: `${finesCount} fines` },
            { label: 'Outstanding',   value: fmt(totalUnpaid), unit: 'unpaid', color: totalUnpaid > 0 ? 'var(--red)' : 'var(--green)' },
            { label: 'Collected',     value: fmt(totalPaid),   unit: 'in account', color: 'var(--green)' },
          ].map(s => (
            <div key={s.label} className="stat-box">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color || 'var(--white)' }}>{s.value}</div>
              <div className="stat-unit">{s.unit}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tabs">
        {[['register','📋 Register'],['players','👤 By Player'],['weeks','📅 By Week'],['videos','🎬 Videos']].map(([v,l]) => (
          <button key={v} className={`btn tab ${view === v ? 'tab-active' : 'tab-inactive'}`} onClick={() => setView(v)}>{l}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button className="btn tab tab-inactive tab-sm" onClick={onFinesList}>⚙️ Fines List</button>
          {isAdmin && (
            <button className="btn tab tab-inactive tab-sm" onClick={onRoster}>✏️ Roster</button>
          )}
        </div>
      </div>
    </div>
  )
}
