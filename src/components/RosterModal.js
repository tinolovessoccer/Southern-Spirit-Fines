import { useState } from 'react'

export default function RosterModal({ players, onSave, onClose }) {
  const [draft, setDraft] = useState([...players, ''])

  function update(i, val) {
    const d = [...draft]
    d[i] = val
    if (i === d.length - 1 && val.trim()) d.push('')
    setDraft(d)
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">EDIT ROSTER</div>
        <div className="modal-sub">Update player names — type in the empty box at the bottom to add a new player</div>
        <div className="grid-2" style={{ marginBottom: 16, maxHeight: 380, overflowY: 'auto' }}>
          {draft.map((p, i) => (
            <input
              key={i}
              value={p}
              onChange={e => update(i, e.target.value)}
              placeholder={i === draft.length - 1 ? '+ Add new player...' : `Player ${i + 1}`}
              style={{ fontSize: 13 }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(draft.map(p => p.trim()).filter(Boolean))}>
            Save Roster
          </button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
