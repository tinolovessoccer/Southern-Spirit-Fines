import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { MATCH_WEEKS } from '../constants'

function getYouTubeId(url) {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function VideoCard({ video, isAdmin, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const ytId = getYouTubeId(video.youtube_url)

  return (
    <div style={{
      background: '#0d2040', border: '1.5px solid var(--line)', borderRadius: 12,
      overflow: 'hidden', transition: 'border 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--sky)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
    >
      {/* Thumbnail / Embed */}
      {!expanded ? (
        <div onClick={() => setExpanded(true)} style={{ position: 'relative', cursor: 'pointer', background: '#000', aspectRatio: '16/9' }}>
          {ytId && (
            <img
              src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
              alt={video.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            />
          )}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#ff000099',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px #00000088',
            }}>
              <div style={{ width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '20px solid #fff', marginLeft: 4 }} />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ aspectRatio: '16/9', background: '#000' }}>
          {ytId && (
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block' }}
            />
          )}
        </div>
      )}

      {/* Info */}
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{video.title}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ background: 'var(--blue2)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{video.week}</span>
            {video.note && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{video.note}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button onClick={() => setExpanded(e => !e)}
            style={{ background: '#1a5cbc33', border: '1px solid #1a5cbc66', color: 'var(--sky)', padding: '4px 10px', borderRadius: 5, fontSize: 11, cursor: 'pointer', fontFamily: "'Barlow', sans-serif", fontWeight: 600 }}>
            {expanded ? 'Close' : 'Play'}
          </button>
          {isAdmin && (
            <button onClick={() => onDelete(video.id)}
              style={{ background: '#e8404011', border: '1px solid #e8404033', color: '#e84040', padding: '4px 8px', borderRadius: 5, fontSize: 11, cursor: 'pointer', fontFamily: "'Barlow', sans-serif", fontWeight: 600 }}>
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VideosView({ isAdmin }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', week: 'Week 1', youtube_url: '', note: '' })
  const [urlError, setUrlError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadVideos()
    const channel = supabase.channel('videos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, loadVideos)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  async function loadVideos() {
    setLoading(true)
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
    if (data) setVideos(data)
    setLoading(false)
  }

  async function handleAdd() {
    if (!form.title.trim() || !form.youtube_url.trim()) return
    const ytId = getYouTubeId(form.youtube_url)
    if (!ytId) { setUrlError('Invalid YouTube URL — paste a youtube.com or youtu.be link'); return }
    setUrlError('')
    setSaving(true)
    await supabase.from('videos').insert([{ title: form.title, week: form.week, youtube_url: form.youtube_url, note: form.note }])
    setForm({ title: '', week: 'Week 1', youtube_url: '', note: '' })
    setShowAdd(false)
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this video?')) return
    await supabase.from('videos').delete().eq('id', id)
    setVideos(v => v.filter(x => x.id !== id))
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: 2 }}>MATCH LIBRARY</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{videos.length} video{videos.length !== 1 ? 's' : ''} recorded</div>
        </div>
        {isAdmin && (
          <button onClick={() => setShowAdd(true)}
            style={{ background: 'var(--blue2)', color: '#fff', padding: '10px 18px', borderRadius: 7, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'Barlow', sans-serif" }}>
            + Add Video
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Loading…</div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 70 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>No match videos yet</div>
          {isAdmin && <div style={{ fontSize: 12, color: 'var(--line)', marginTop: 6 }}>Click + Add Video to get started</div>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {videos.map(v => <VideoCard key={v.id} video={v} isAdmin={isAdmin} onDelete={handleDelete} />)}
        </div>
      )}

      {/* Add Video Modal */}
      {showAdd && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div className="modal-title">ADD MATCH VIDEO</div>
            <div className="modal-sub">Paste a YouTube link from a recorded game</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label>Match Title</label>
                <input placeholder="e.g. vs Adelaide United — Round 3" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label>YouTube URL</label>
                <input placeholder="https://youtube.com/watch?v=..." value={form.youtube_url}
                  onChange={e => { setForm({ ...form, youtube_url: e.target.value }); setUrlError('') }} />
                {urlError && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{urlError}</div>}
              </div>
              <div className="grid-2">
                <div>
                  <label>Match Week</label>
                  <select value={form.week} onChange={e => setForm({ ...form, week: e.target.value })}>
                    {['Preseason Week 1','Preseason Week 2','Preseason Week 3','Preseason Week 4','Preseason Week 5','Preseason Week 6',
                      ...MATCH_WEEKS].map(w => <option key={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label>Note (optional)</label>
                  <input placeholder="e.g. Full match" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={handleAdd} disabled={saving}
                style={{ flex: 1, background: 'var(--blue2)', color: '#fff', padding: 12, borderRadius: 7, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'Barlow', sans-serif" }}>
                {saving ? 'Saving…' : 'Add Video'}
              </button>
              <button onClick={() => setShowAdd(false)}
                style={{ padding: '12px 18px', background: 'transparent', border: '1.5px solid var(--line)', color: 'var(--muted)', borderRadius: 7, fontSize: 13, cursor: 'pointer', fontFamily: "'Barlow', sans-serif", fontWeight: 600 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
