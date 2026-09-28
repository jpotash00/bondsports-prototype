import { useState } from 'react';
import { Eye, EyeOff, MapPin } from 'lucide-react';
import { Logo, Meter, QR } from './ui';

const M = '#D98A1C', L = '#3E8E68', J = '#4F739C';
const WEEK = [['S', 27, []], ['M', 28, []], ['T', 29, [M]], ['W', 30, [L, J]], ['T', 1, [M, J]], ['F', 2, []], ['S', 3, [M, M]]];

const Google = () => (
  <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);
const Apple = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
    <path d="M16.37 1.43c0 1.14-.49 2.27-1.18 3.08-.74.9-1.99 1.57-2.99 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.57-2.27 1.21-2.98.8-.94 2.14-1.64 3.25-1.68.03.13.05.28.05.43zm4.56 15.71c-.03.07-.46 1.58-1.52 3.12-.94 1.34-1.94 2.71-3.43 2.71-1.52 0-1.9-.88-3.63-.88-1.7 0-2.3.91-3.67.91-1.38 0-2.33-1.26-3.43-2.8-1.29-1.82-2.32-4.63-2.32-7.28 0-4.28 2.8-6.55 5.55-6.55 1.45 0 2.68.95 3.6.95.87 0 2.22-1.01 3.9-1.01.61 0 2.89.06 4.37 2.19-.13.09-2.38 1.37-2.38 4.19 0 3.26 2.85 4.42 2.96 4.45z" />
  </svg>
);
const Microsoft = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
    <rect width="9" height="9" fill="#F25022" /><rect x="11" width="9" height="9" fill="#7FBA00" />
    <rect y="11" width="9" height="9" fill="#00A4EF" /><rect x="11" y="11" width="9" height="9" fill="#FFB900" />
  </svg>
);
const Yahoo = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
    <circle cx="10" cy="10" r="10" fill="#6001D2" />
    <text x="10" y="14" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">y!</text>
  </svg>
);

const PROVIDERS = [['Google', Google], ['Apple', Apple], ['Microsoft', Microsoft], ['Yahoo', Yahoo]];

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const enter = () => { location.hash = '/'; };

  return (
    <div className="login">
      <main className="login-form-side">
        <div className="login-form">
          <Logo />
          <h1>Welcome back</h1>
          <p className="lede">Log in to see your teams, schedule and passes.</p>

          <div className="sso">
            {PROVIDERS.map(([name, Icon]) => (
              <button key={name} className="sso-btn" onClick={enter}><Icon />{name}</button>
            ))}
          </div>

          <div className="or"><span>or use email</span></div>

          <form onSubmit={e => { e.preventDefault(); enter(); }}>
            <label className="field">
              <span className="field-label">Email</span>
              <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            <label className="field">
              <span className="field-label-row">
                <span className="field-label">Password</span>
                <a href="#/login" className="text-link small">Forgot password?</a>
              </span>
              <span className="pw">
                <input type={show ? 'text' : 'password'} autoComplete="current-password" value={pw} onChange={e => setPw(e.target.value)} required />
                <button type="button" className="icon-btn" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(s => !s)}>
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            <button className="btn btn-primary btn-block btn-lg" disabled={!email || !pw}>Sign in</button>
          </form>
          <p className="login-foot">New to Bond Sports? <a className="text-link" href="#/login">Create an account</a></p>
          <button className="demo-link" onClick={enter}>Skip to the demo portal →</button>
        </div>
      </main>

      <aside className="login-brand" aria-hidden="true">
        <div className="lb-inner">
          <Logo size="lg" />
          <h2 className="lb-head">Your teams, games and bookings, all in one place.</h2>

          <div className="lb-grid">
            <div className="lbp lbp-next">
              <div className="lbp-row">
                <span className="lbp-label">Next up</span>
                <span className="lbp-pill">Saturday</span>
              </div>
              <div className="lbp-next-main">
                <strong className="lbp-time">9:00 AM</strong>
                <div>
                  <p className="lbp-title">Thunder vs Gresham United</p>
                  <p className="lbp-meta"><MapPin size={14} />Delta Park · Field 3</p>
                </div>
              </div>
            </div>

            <div className="lbp lbp-pass">
              <span className="lbp-label">Open Gym Punch Pass</span>
              <p className="lbp-big">15<span> of 20 visits left</span></p>
              <Meter value={15} max={20} label="Visits left" />
            </div>

            <div className="lbp lbp-id">
              <QR seed="BND 2048 8817" size={64} />
              <div>
                <span className="lbp-label">Bond ID</span>
                <p className="lbp-title">Check in with one scan</p>
              </div>
            </div>

            <div className="lbp lbp-week">
              <span className="lbp-label">This week</span>
              <div className="lbp-days">
                {WEEK.map(([d, n, dots]) => (
                  <span key={d} className="lbp-day" data-today={n === 28}>
                    <small>{d}</small>
                    <b>{n}</b>
                    <i>{dots.map((c, k) => <em key={k} style={{ background: c }} />)}</i>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
