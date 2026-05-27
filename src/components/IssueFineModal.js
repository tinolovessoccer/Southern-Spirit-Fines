import { useState } from 'react'
import { MATCH_WEEKS } from '../constants'

function fmt(val) { return `$${parseFloat(val || 0).toFixed(2)}` }

function StepPlayer({ players, onSelect }) {
  const [search, setSearch] = useState('')
  const shown = players.filter(p => p.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <div className="modal-title">SELECT PLAYER</div>
      <div className="modal-sub">Who's getting fined?</div>
      <input placeholder="Search player…" value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 12, fontSize: 13 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
        {shown.map(p => (
          <button key={p} onClick={() => onSelect(p)}
            style={{ background: '#0d2040', border: '1.5px solid var(--line)', color: 'var(--white)', borderRadius: 8, padding: '11px 13px', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: "'Barlow', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--sky)'; e.currentTarget.style.background = '#112d54' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = '#0d2040' }}>
            ⚽ {p}
          </button>
        ))}
      </div>
    </div>
  )
}

function StepFines({ fineMenu, player, onBack, onConfirm }) {
  const [selected, setSelected] = useState([])
  const [week, setWeek] = useState('Week 1')
  const [customAmounts, setCustomAmounts] = useState({})
  const [customLabels, setCustomLabels] = useState({})
  const [note, setNote] = useState('')

  function toggle(item) {
    setSelected(s => s.find(x => x.id === item.id) ? s.filter(x => x.id !== item.id) : [...s, item])
  }

  const total = selected.reduce((sum, item) =>
    sum + (item.custom ? parseFloat(customAmounts[item.id] || 0) : item.amount), 0)

  function handleConfirm() {
    if (!selected.length) return
    onConfirm(selected.map(item => ({
      player, week, note, status: 'Unpaid',
      type: item.custom ? (customLabels[item.id] || 'Custom Fine') : item.label,
      amount: item.custom ? parseFloat(customAmounts[item.id] || 0) : item.amount,
    })))
  }

  return (
    <div>
      <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', fontFamily: "'Barlow', sans-serif", marginBottom: 8, padding: 0 }}>← Back</button>
      <div className="modal-title">SELECT FINES</div>
      <div style={{ fontSize: 13, color: 'var(--white)', fontWeight: 600, marginBottom: 12 }}>⚽ {player}</div>
      <div className="fine-grid">
        {fineMenu.map(item => {
          const isOn = !!selected.find(x => x.id === item.id)
          return (
            <div key={item.id} onClick={() => toggle(item)} className={`fine-card ${isOn ? 'fine-card-on' : 'fine-card-off'}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 18, marginBottom: 3 }}>{item.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isOn ? 'var(--white)' : 'var(--offwhite)', lineHeight: 1.3 }}>{item.label}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {!item.custom && <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, color: isOn ? 'var(--sky)' : 'var(--muted)' }}>{fmt(item.amount)}</div>}
                  {isOn && <div style={{ fontSize: 14, marginTop: 2 }}>✓</div>}
                </div>
              </div>
              {item.custom && isOn && (
                <div style={{ marginTop: 8 }} onClick={e => e.stopPropagation()}>
                  <input placeholder="Fine name…" value={customLabels[item.id] || ''} onChange={e => setCustomLabels(l => ({ ...l, [item.id]: e.target.value }))} style={{ fontSize: 12, padding: '5px 8px', marginBottom: 4 }} />
                  <input type="number" placeholder="Amount $" value={customAmounts[item.id] || ''} onChange={e => setCustomAmounts(a => ({ ...a, [item.id]: e.target.value }))} style={{ fontSize: 12, padding: '5px 8px' }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="grid-2" style={{ marginBottom: 10 }}>
        <div>
          <label>Match Week</label>
          <select value={week} onChange={e => setWeek(e.target.value)} style={{ fontSize: 13 }}>
            {MATCH_WEEKS.map(w => <option key={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <label>Note (optional)</label>
          <input placeholder="Details…" value={note} onChange={e => setNote(e.target.value)} style={{ fontSize: 13 }} />
        </div>
      </div>
      {selected.length > 0 && (
        <div style={{ background: '#0b1f3a', border: '1.5px solid var(--blue)', borderRadius: 8, padding: '10px 14px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{selected.length} fine{selected.length !== 1 ? 's' : ''} selected</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--sky)' }}>Total: {fmt(total)}</div>
        </div>
      )}
      <button onClick={handleConfirm} disabled={!selected.length}
        style={{ width: '100%', background: selected.length ? 'var(--blue2)' : '#1a2a40', color: selected.length ? '#fff' : 'var(--muted)', padding: 12, borderRadius: 7, fontSize: 14, fontWeight: 700, cursor: selected.length ? 'pointer' : 'default', border: 'none', fontFamily: "'Barlow', sans-serif", transition: 'all 0.15s' }}>
        {selected.length === 0 ? 'Select at least one fine' : `Issue ${selected.length} Fine${selected.length !== 1 ? 's' : ''} → ${fmt(total)}`}
      </button>
    </div>
  )
}

export default function IssueFineModal({ players, fineMenu, onConfirm, onClose }) {
  const [step, setStep] = useState(1)
  const [player, setPlayer] = useState(null)

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="step-bar">
          {[1, 2].map(s => <div key={s} className="step-seg" style={{ background: step >= s ? 'var(--blue2)' : 'var(--line)' }} />)}
        </div>
        {step === 1 && <StepPlayer players={players} onSelect={p => { setPlayer(p); setStep(2) }} />}
        {step === 2 && <StepFines fineMenu={fineMenu} player={player} onBack={() => setStep(1)} onConfirm={onConfirm} />}
      </div>
    </div>
  )
}
