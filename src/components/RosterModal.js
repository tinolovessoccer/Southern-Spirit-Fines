import { useState } from 'react'

export default function RosterModal({ players, onSave, onClose }) {
  const [draft, setDraft] = useState([...players])

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">EDIT ROSTER</div>
        <div className="modal-sub">Update player names for the squad</div>
        <div className="grid-2" style={{ marginBottom: 16, maxHeight: 380, overflowY: 'auto' }}>
          {draft.map((p, i) => (
            <input key={i} value={p} onChange={e => { const d = [...draft]; d[i] = e.target.value; setDraft(d) }} placeholder={`Player ${i + 1}`} style={{ fontSize: 13 }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(draft.map(p => p.trim()).filter(Boolean))}>Save Roster</button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
