import { useEffect } from 'react';
import SportsBall from './SportsBall';
import { ArrowRight } from 'lucide-react';
import { TODAY, events, people } from './data';

// App-wide actions without prop drilling.
export const toast = msg => dispatchEvent(new CustomEvent('bs-toast', { detail: msg }));
export const openId = () => dispatchEvent(new Event('bs-open-id'));

export const isoOf = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const dayOf = iso => new Date(`${iso}T00:00`);
export const evStart = e => new Date(`${e.date}T${e.start}`);
export const fmtDay = (iso, o = { weekday: 'short', month: 'short', day: 'numeric' }) => dayOf(iso).toLocaleDateString('en-US', o);
export const fmtTime = t => {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};
// The signed-in member reads as "You"; everyone else by first name.
export const nameOf = who => (who === 'jordan' ? 'You' : people[who].first);
export const money = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
export const ageOf = dob => {
  const b = dayOf(dob);
  let a = TODAY.getFullYear() - b.getFullYear();
  if (TODAY < new Date(TODAY.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a;
};
export function relDay(iso) {
  const diff = Math.round((dayOf(iso) - dayOf(isoOf(TODAY))) / 864e5);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return fmtDay(iso);
}
// Countdown for a pill: "Tomorrow", "In 5 days", "In 2 weeks".
export function countdown(iso) {
  const diff = Math.round((dayOf(iso) - dayOf(isoOf(TODAY))) / 864e5);
  if (diff <= 1) return relDay(iso);
  if (diff < 14) return `In ${diff} days`;
  return `In ${Math.round(diff / 7)} weeks`;
}

// Close a popover on Escape or an outside click.
export function useDismiss(ref, open, close) {
  useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === 'Escape' && close();
    const onDown = e => ref.current && !ref.current.contains(e.target) && close();
    addEventListener('keydown', onKey);
    addEventListener('mousedown', onDown);
    return () => {
      removeEventListener('keydown', onKey);
      removeEventListener('mousedown', onDown);
    };
  }, [open]);
}

export function Avatar({ who, person, size = 32 }) {
  const p = person || people[who];
  const initials = p.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return (
    <span
      className="avatar"
      style={{ '--c': p.color, width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function Who({ who }) {
  return (
    <span className="who" style={{ '--c': people[who].color }}>
      {nameOf(who)}
    </span>
  );
}

export function Badge({ tone = 'neutral', children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Tabs({ tabs, value, onChange, label }) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map(([key, text, count]) => (
        <button
          key={key}
          role="tab"
          aria-selected={value === key}
          className="tab"
          onClick={() => onChange(key)}
        >
          {text}
          {count != null && <span className="tab-count">{count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Meter({ value, max, label }) {
  return (
    <div className="meter" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      <span style={{ width: `${(value / max) * 100}%` }} />
    </div>
  );
}

export function Empty({ icon: Icon, title, children }) {
  return (
    <div className="empty">
      <span className="empty-icon"><Icon size={22} /></span>
      <p className="empty-title">{title}</p>
      <p className="empty-body">{children}</p>
    </div>
  );
}

// Static baseball, used when WebGL isn't available.
const Ball = ({ size, fill, children }) => (
  <svg className="ball" viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
    <circle cx="20" cy="20" r="18.5" fill={fill} />
    {children}
    <circle className="ball-ring" cx="20" cy="20" r="18.5" fill="none" />
  </svg>
);
const Baseball = ({ size }) => (
  <Ball size={size} fill="#FBFAF6">
    <path d="M8.5 6.5c4.6 3.6 7 8.2 7 13.5s-2.4 9.9-7 13.5M31.5 6.5c-4.6 3.6-7 8.2-7 13.5s2.4 9.9 7 13.5" fill="none" stroke="#D2463C" strokeWidth="1.5" strokeDasharray="1.6 1.9" />
  </Ball>
);
export function Logo({ size = 'sm' }) {
  return (
    <span className={`logo logo-${size}`} aria-label="Bond Sports">
      <span className="logo-bond" aria-hidden="true">
        B<span className="logo-ball"><SportsBall fallback={<Baseball size="0.86em" />} /></span>ND
      </span>
      <span className="logo-sports" aria-hidden="true">Sports</span>
    </span>
  );
}

// Deterministic, decorative QR-style code for the mock member ID.
export function QR({ seed, size = 168 }) {
  const n = 25;
  let s = 0;
  for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  const corners = [[0, 0], [n - 7, 0], [0, n - 7]];
  const nearCorner = (x, y) => corners.some(([cx, cy]) => x >= cx - 1 && x <= cx + 7 && y >= cy - 1 && y <= cy + 7);
  const cells = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (!nearCorner(x, y) && rnd() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
  return (
    <svg viewBox={`-2 -2 ${n + 4} ${n + 4}`} width={size} height={size} shapeRendering="crispEdges" role="img" aria-label="Member QR code">
      <rect x="-2" y="-2" width={n + 4} height={n + 4} fill="#fff" />
      <g fill="#1A2B42">
        {cells}
        {corners.map(([x, y]) => (
          <g key={`${x}${y}`}>
            <rect x={x} y={y} width="7" height="7" />
            <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
            <rect x={x + 2} y={y + 2} width="3" height="3" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* Shared page pieces */

export const upcoming = () => events.filter(e => evStart(e) >= TODAY);
export const nextFor = teamId => upcoming().find(e => e.team === teamId);
export const todayIso = isoOf(TODAY);

export function PageHead({ title, lede, children }) {
  return (
    <header className="page-head">
      <div>
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {children && <div className="page-actions">{children}</div>}
    </header>
  );
}

export function TileHead({ title, href, link }) {
  return (
    <div className="tile-head">
      <h2>{title}</h2>
      {href && <a className="tile-link" href={href}>{link}<ArrowRight size={16} /></a>}
    </div>
  );
}

export function DateBlock({ iso, tone }) {
  const d = dayOf(iso);
  return (
    <span className={`dateblock ${tone ? `dateblock-${tone}` : ''}`}>
      <span className="db-mon">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
      <span className="db-day">{d.getDate()}</span>
    </span>
  );
}

const SPORT = { Soccer: ['green', 'SOC'], Basketball: ['gold', 'BKB'], Softball: ['blue', 'SFB'], Pickleball: ['violet', 'PKL'] };
export function SportMark({ sport }) {
  const [tone, abbr] = SPORT[sport];
  return <span className={`sportmark sportmark-${tone}`} title={sport}><span aria-hidden="true">{abbr}</span><span className="sr-only">{sport}</span></span>;
}
