import { useEffect, useRef, useState } from 'react';
import {
  House, Users, CalendarDays, MapPin, Ticket, MessageCircleQuestion, Mail, X,
  ChevronDown, Settings as SettingsIcon, IdCard, LogOut, Receipt,
} from 'lucide-react';
import { balance, me } from './data';
import { Avatar, Logo, QR, money, openId, toast, useDismiss } from './ui';
import { Home, Schedule, Reservations, Passes } from './pages';
import { Teams } from './Teams';
import Settings from './Settings';
import Login from './Login';

const NAV = [
  ['/', 'Home', House],
  ['/teams', 'Teams', Users],
  ['/schedule', 'Schedule', CalendarDays],
  ['/reservations', 'Reservations', MapPin],
  ['/passes', 'Passes', Ticket],
];

function useRoute() {
  const read = () => location.hash.slice(1) || '/login';
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onChange = () => { setRoute(read()); scrollTo(0, 0); };
    addEventListener('hashchange', onChange);
    return () => removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

const isActive = (route, path) => (path === '/' ? route === '/' : route.startsWith(path));

export default function App() {
  const route = useRoute();
  if (route === '/login') return <Login />;

  const page =
    route.startsWith('/teams') ? <Teams route={route} /> :
    route.startsWith('/schedule') ? <Schedule /> :
    route.startsWith('/reservations') ? <Reservations /> :
    route.startsWith('/passes') ? <Passes /> :
    route.startsWith('/settings') ? <Settings tab={route.split('/')[2] || 'profile'} /> :
    <Home />;

  return (
    <div className="shell">
      <TopBar route={route} />
      <main className="main" key={route.split('/')[1]}>{page}</main>
      <nav className="bottomnav" aria-label="Primary">
        {NAV.map(([path, label, Icon]) => (
          <a key={path} href={`#${path}`} aria-current={isActive(route, path) ? 'page' : undefined}>
            <Icon size={22} strokeWidth={isActive(route, path) ? 2.2 : 1.8} />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <Help />
      <IdDialog />
      <Toaster />
    </div>
  );
}

function TopBar({ route }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a href="#/" className="brand">
          <Logo />
        </a>
        <nav className="topnav" aria-label="Primary">
          {NAV.map(([path, label]) => (
            <a key={path} href={`#${path}`} aria-current={isActive(route, path) ? 'page' : undefined}>{label}</a>
          ))}
        </nav>
        <div className="topbar-end">
          <a href="#/settings/history" className="balance-chip" title="Account credit">
            <strong>{money(balance.credit)}</strong><span className="bc-label">credit</span>
          </a>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useDismiss(ref, open, () => setOpen(false));
  const pick = () => setOpen(false);
  return (
    <div className="menu" ref={ref}>
      <button className="menu-trigger" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(o => !o)}>
        <Avatar who="jordan" size={34} />
        <span className="menu-name">{me.first}</span>
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className="menu-panel" role="menu">
          <div className="menu-head">
            <Avatar who="jordan" size={40} />
            <div>
              <p className="menu-head-name">{me.first} {me.last}</p>
              <p className="menu-head-sub">{me.email}</p>
            </div>
          </div>
          <a role="menuitem" href="#/settings/profile" onClick={pick}><SettingsIcon size={18} />Profile & settings</a>
          <button role="menuitem" onClick={() => { pick(); openId(); }}><IdCard size={18} />See my ID</button>
          <a role="menuitem" href="#/settings/history" onClick={pick}><Receipt size={18} />Purchase history</a>
          <hr />
          <a role="menuitem" href="#/login" onClick={pick}><LogOut size={18} />Sign out</a>
        </div>
      )}
    </div>
  );
}

function Help() {
  const [sent, setSent] = useState(false);
  const click = () => {
    setSent(true);
    toast('Opening your email app…');
    setTimeout(() => setSent(false), 1400);
  };
  return (
    <a className="help-fab" data-sent={sent} href="mailto:frontdesk@example.com" aria-label="Need help? Email us" data-tip="Help & support" onClick={click}>
      <span className="help-icon" key={sent}>{sent ? <Mail size={22} /> : <MessageCircleQuestion size={24} />}</span>
    </a>
  );
}

function IdDialog() {
  const ref = useRef();
  useEffect(() => {
    const show = () => ref.current.showModal();
    addEventListener('bs-open-id', show);
    return () => removeEventListener('bs-open-id', show);
  }, []);
  return (
    <dialog ref={ref} className="id-dialog" aria-label="My Bond ID" onClick={e => e.target === ref.current && ref.current.close()}>
      <div className="id-card">
        <div className="id-top">
          <Logo />
          <button className="icon-btn icon-btn-light" aria-label="Close" onClick={() => ref.current.close()}><X size={20} /></button>
        </div>
        <div className="id-person">
          <Avatar who="jordan" size={56} />
          <div>
            <p className="id-name">{me.first} {me.last}</p>
            <p className="id-sub">Member since {me.since}</p>
          </div>
        </div>
        <div className="id-code">
          <QR seed={me.memberId} size={188} />
          <p className="id-number">{me.memberId}</p>
        </div>
        <p className="id-hint">Show this at the front desk to check in or use a pass.</p>
        <div className="wallet-row mobile-only">
          <button className="wallet-btn wallet-apple">Add to Apple Wallet</button>
          <button className="wallet-btn wallet-google">Add to Google Wallet</button>
        </div>
        <p className="id-hint desktop-only">Open the portal on your phone to add this ID to Apple or Google Wallet.</p>
      </div>
    </dialog>
  );
}

function Toaster() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    let t;
    const on = e => { setMsg(e.detail); clearTimeout(t); t = setTimeout(() => setMsg(null), 2800); };
    addEventListener('bs-toast', on);
    return () => removeEventListener('bs-toast', on);
  }, []);
  return <div className="toast" role="status" aria-live="polite" data-show={!!msg}>{msg}</div>;
}
