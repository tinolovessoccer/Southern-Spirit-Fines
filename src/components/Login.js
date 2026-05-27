import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login({ onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Invalid email or password')
    else onClose()
    setLoading(false)
  }

  function handleKey(e) { if (e.key === 'Enter') handleLogin() }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="login-box">
        <div style={{ fontSize: 32, marginBottom: 10 }}>🔐</div>
        <div className="modal-title">ADMIN LOGIN</div>
        <div className="modal-sub">Sign in to unlock editing</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} placeholder="your@email.com" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} placeholder="••••••••" />
          </div>
        </div>
        {error && <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 12 }}>{error}</div>}
        <button className="btn btn-primary" style={{ width: '100%', marginBottom: 10 }} onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
        <button className="btn btn-outline" style={{ width: '100%' }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}
