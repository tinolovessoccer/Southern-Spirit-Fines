import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Login from './components/Login'
import Header from './components/Header'
import RegisterView from './components/RegisterView'
import PlayersView from './components/PlayersView'
import WeeksView from './components/WeeksView'
import VideosView from './components/VideosView'
import IssueFineModal from './components/IssueFineModal'
import EditFineModal from './components/EditFineModal'
import FinesListModal from './components/FinesListModal'
import PaymentModal from './components/PaymentModal'
import RosterModal from './components/RosterModal'
import { DEFAULT_FINE_MENU, PLAYERS } from './constants'
import './styles.css'

export default function App() {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [fines, setFines] = useState([])
  const [fineMenu, setFineMenu] = useState(DEFAULT_FINE_MENU)
  const [players, setPlayers] = useState(PLAYERS)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('register')

  // Modal states
  const [showIssue, setShowIssue] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showFinesList, setShowFinesList] = useState(false)
  const [showRoster, setShowRoster] = useState(false)
  const [editingFine, setEditingFine] = useState(null)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) checkAdmin(session.user)
    })
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) checkAdmin(session.user)
      else setIsAdmin(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function checkAdmin(user) {
    const { data } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .single()
    setIsAdmin(!!data)
  }

  useEffect(() => {
    loadFines()
    loadSettings()

    // Real-time subscription for fines
    const channel = supabase
      .channel('fines-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fines' }, () => loadFines())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function loadFines() {
    setLoading(true)
    const { data, error } = await supabase
      .from('fines')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setFines(data)
    setLoading(false)
  }

  async function loadSettings() {
    const { data } = await supabase.from('settings').select('*')
    if (data) {
      const menu = data.find(s => s.key === 'fine_menu')
      const roster = data.find(s => s.key === 'roster')
      if (menu) setFineMenu(JSON.parse(menu.value))
      if (roster) setPlayers(JSON.parse(roster.value))
    }
  }

  async function saveSetting(key, value) {
    await supabase.from('settings').upsert({ key, value: JSON.stringify(value) }, { onConflict: 'key' })
  }

  async function handleIssueFines(newFines) {
    const rows = newFines.map(f => ({
      player: f.player,
      week: f.week,
      type: f.type,
      amount: f.amount,
      note: f.note || '',
      status: 'Unpaid',
    }))
    await supabase.from('fines').insert(rows)
    setShowIssue(false)
  }

  async function toggleStatus(fine) {
    const newStatus = fine.status === 'Paid' ? 'Unpaid' : 'Paid'
    await supabase.from('fines').update({ status: newStatus }).eq('id', fine.id)
    setFines(prev => prev.map(f => f.id === fine.id ? { ...f, status: newStatus } : f))
  }

  async function deleteFine(id) {
    if (!window.confirm('Remove this fine?')) return
    await supabase.from('fines').delete().eq('id', id)
    setFines(prev => prev.filter(f => f.id !== id))
  }

  async function saveEditFine(updated) {
    await supabase.from('fines').update({
      player: updated.player,
      week: updated.week,
      type: updated.type,
      amount: parseFloat(updated.amount),
      note: updated.note,
      status: updated.status,
    }).eq('id', updated.id)
    setFines(prev => prev.map(f => f.id === updated.id ? { ...f, ...updated, amount: parseFloat(updated.amount) } : f))
    setEditingFine(null)
  }

  async function saveFineMenu(menu) {
    setFineMenu(menu)
    await saveSetting('fine_menu', menu)
    setShowFinesList(false)
  }

  async function saveRoster(roster) {
    setPlayers(roster)
    await saveSetting('roster', roster)
    setShowRoster(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsAdmin(false)
  }

  const totalAll = fines.reduce((s, f) => s + Number(f.amount), 0)
  const totalPaid = fines.filter(f => f.status === 'Paid').reduce((s, f) => s + Number(f.amount), 0)
  const totalUnpaid = fines.filter(f => f.status === 'Unpaid').reduce((s, f) => s + Number(f.amount), 0)

  return (
    <div className="app">
      <Header
        isAdmin={isAdmin}
        session={session}
        totalAll={totalAll}
        totalPaid={totalPaid}
        totalUnpaid={totalUnpaid}
        finesCount={fines.length}
        view={view}
        setView={setView}
        onIssue={() => setShowIssue(true)}
        onPayment={() => setShowPayment(true)}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
        onFinesList={() => setShowFinesList(true)}
        onRoster={() => setShowRoster(true)}
      />

      {view === 'register' && (
        <RegisterView
          fines={fines}
          players={players}
          loading={loading}
          isAdmin={isAdmin}
          onToggleStatus={toggleStatus}
          onEdit={setEditingFine}
          onDelete={deleteFine}
        />
      )}
      {view === 'players' && <PlayersView fines={fines} players={players} />}
      {view === 'weeks' && <WeeksView fines={fines} setView={setView} />}
      {view === 'videos' && <VideosView isAdmin={isAdmin} />}

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showIssue && isAdmin && (
        <IssueFineModal
          players={players}
          fineMenu={fineMenu}
          onConfirm={handleIssueFines}
          onClose={() => setShowIssue(false)}
        />
      )}
      {editingFine && isAdmin && (
        <EditFineModal
          fine={editingFine}
          players={players}
          onSave={saveEditFine}
          onClose={() => setEditingFine(null)}
        />
      )}
      {showFinesList && isAdmin && (
        <FinesListModal
          fineMenu={fineMenu}
          onSave={saveFineMenu}
          onClose={() => setShowFinesList(false)}
        />
      )}
      {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
      {showRoster && isAdmin && (
        <RosterModal
          players={players}
          onSave={saveRoster}
          onClose={() => setShowRoster(false)}
        />
      )}
    </div>
  )
}
