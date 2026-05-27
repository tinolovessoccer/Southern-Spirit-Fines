import { useState } from 'react'

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7) }

export default function FinesListModal({ fineMenu, onSave, onClose }) {
  const [draft, setDraft] = useState([...fineMenu])

  function update(i, field, val) {
    const d = [...draft]; d[i] = { ...d[i], [field]: val }; setDraft(d)
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">FINES LIST</div>
        <div className="modal-sub">Edit, remove or add fine types. These appear when issuing fines.</div>
        <div style={{ maxHeight: 360, overflowY: 'auto', marginBottom: 14 }}>
          {draft.map((item, i) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 36px', gap: 6, marginBottom: 8, alignItems: 'center' }}>
              <input value={item.emoji} onChange={e => update(i, 'emoji', e.target.value)} style={{ fontSize: 18, textAlign: 'center', padding: '6px 4px' }} maxLength={2} />
              <input value={item.label} onChange={e => update(i, 'label', e.target.value)} placeholder="Fine name…" style={{ fontSize: 13 }} />
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 13 }}>$</span>
                <input type="number" min="0" step="1" value={item.amount} onChange={e => update(i, 'amount', parseFloat(e.target.value) || 0)} style={{ fontSize: 13, paddingLeft: 22 }} disabled={item.custom} />
              </div>
              <button onClick={() => setDraft(d => d.filter((_, j) => j !== i))}
                style={{ background: '#e8404011', border: '1px solid #e8404033', color: '#e84040', borderRadius: 6, padding: '6px', cursor: 'pointer', fontSize: 14, fontFamily: "'Barlow', sans-serif" }}>✕</button>
            </div>
          ))}
        </div>
        <button className="btn btn-outline" style={{ width: '100%', border: '1.5px dashed var(--line)', marginBottom: 14 }}
          onClick={() => setDraft(d => [...d, { id: genId(), label: '', amount: 0, emoji: '⚽', custom: false }])}>
          + Add Fine Type
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(draft.filter(m => m.label.trim()))}>Save List</button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
