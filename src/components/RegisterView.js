import { useState } from 'react'
import { MATCH_WEEKS } from '../constants'

function fmt(val) { return `$${parseFloat(val || 0).toFixed(2)}` }

export default function RegisterView({ fines, players, loading, isAdmin, onToggleStatus, onEdit, onDelete }) {
  const [filterPlayer, setFilterPlayer] = useState('All')
  const [filterWeek, setFilterWeek] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  const filtered = fines
    .filter(f => filterPlayer === 'All' || f.player === filterPlayer)
    .filter(f => filterWeek === 'All' || f.week === filterWeek)
    .filter(f => filterStatus === 'All' || f.status === filterStatus)
    .sort((a, b) => {
      const wa = parseInt(a.week?.split(' ')[1] || 0)
      const wb = parseInt(b.week?.split(' ')[1] || 0)
      return wa !== wb ? wa - wb : a.player.localeCompare(b.player)
    })

  return (
    <div>
      <div className="filters">
        <select value={filterPlayer} onChange={e => setFilterPlayer(e.target.value)} style={{ width: 'auto', fontSize: 12, padding: '6px 10px' }}>
          <option value="All">All Players</option>
          {players.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={filterWeek} onChange={e => setFilterWeek(e.target.value)} style={{ width: 'auto', fontSize: 12, padding: '6px 10px' }}>
          <option value="All">All Weeks</option>
          {MATCH_WEEKS.map(w => <option key={w}>{w}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 'auto', fontSize: 12, padding: '6px 10px' }}>
          <option value="All">All Status</option>
          <option>Unpaid</option>
          <option>Paid</option>
        </select>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="empty"><div className="empty-text">Loading…</div></div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">⚽</div>
          <div className="empty-text">{fines.length === 0 ? 'No fines issued yet' : 'No results match filters'}</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                {['Week','Player','Offence','Note','Amount','Status',...(isAdmin ? [''] : [])].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(fine => (
                <tr key={fine.id}>
                  <td><span className="week-badge">{fine.week}</span></td>
                  <td style={{ fontWeight: 600 }}>{fine.player}</td>
                  <td style={{ color: 'var(--offwhite)' }}>{fine.type}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 12, maxWidth: 160 }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fine.note || '—'}</span>
                  </td>
                  <td style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 17, color: fine.status === 'Paid' ? 'var(--green)' : 'var(--sky)', whiteSpace: 'nowrap' }}>
                    {fmt(fine.amount)}
                  </td>
                  <td>
                    {isAdmin ? (
                      <button className={`btn status-pill ${fine.status === 'Paid' ? 'status-paid' : 'status-unpaid'}`} onClick={() => onToggleStatus(fine)}>
                        {fine.status}
                      </button>
                    ) : (
                      <span className={`status-pill ${fine.status === 'Paid' ? 'status-paid' : 'status-unpaid'}`}>{fine.status}</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button className="btn btn-edit" onClick={() => onEdit(fine)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => onDelete(fine.id)}>✕</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
