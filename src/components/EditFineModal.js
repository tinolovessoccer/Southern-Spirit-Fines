import { useState } from 'react'
import { MATCH_WEEKS } from '../constants'

export default function EditFineModal({ fine, players, onSave, onClose }) {
  const [form, setForm] = useState({ ...fine })

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">EDIT FINE</div>
        <div className="grid-2">
          <div className="col-span-2">
            <label>Player</label>
            <select value={form.player} onChange={e => setForm({ ...form, player: e.target.value })}>
              {players.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label>Week</label>
            <select value={form.week} onChange={e => setForm({ ...form, week: e.target.value })}>
              {MATCH_WEEKS.map(w => <option key={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option>Unpaid</option><option>Paid</option>
            </select>
          </div>
          <div className="col-span-2">
            <label>Offence</label>
            <input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
          </div>
          <div>
            <label>Amount ($)</label>
            <input type="number" min="0" step="0.50" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div>
            <label>Note</label>
            <input value={form.note || ''} onChange={e => setForm({ ...form, note: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(form)}>Save Changes</button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
