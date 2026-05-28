import { PAYMENT_INFO } from '../constants'

export default function PaymentModal({ onClose }) {
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>💳</div>
        <div className="modal-title">PAY YOUR FINES</div>
        <div className="modal-sub">Transfer directly to the club account below</div>
        <div style={{ background: '#0b1f3a', border: '1.5px solid var(--blue)', borderRadius: 10, padding: 24, textAlign: 'left', marginBottom: 14 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1.5, marginBottom: 4 }}>ACCOUNT NAME</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>⚽ Southern Spirit Fines</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1.5, marginBottom: 4 }}>BANK DETAILS</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--sky)', letterSpacing: 1 }}>
              BSB: 670-864 · Account: 36012242
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1.5, marginBottom: 4 }}>REFERENCE</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--green)' }}>Your name + Fines (e.g. John Smith Fines)</div>
          </div>
        </div>
        <div style={{ padding: '12px 16px', background: '#1ec97a11', border: '1px solid #1ec97a33', borderRadius: 8, fontSize: 12, color: 'var(--green)', marginBottom: 16 }}>
          Once paid, notify your fines officer to mark it as paid in the register.
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>Got it</button>
      </div>
    </div>
  )
}
 