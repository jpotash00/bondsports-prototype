import { useRef, useState } from 'react';
import {
  ArrowRight, CalendarPlus, ChevronLeft, ChevronRight, Clock, MapPin, Navigation,
  Trophy, Users, Ticket, RotateCcw, IdCard, CalendarDays, X, Dumbbell, WavesLadder, Target, TentTree,
} from 'lucide-react';
import { TODAY, accounts, balance, events, me, passes, people, reservations, rosters, standings, teams } from './data';
import {
  Avatar, Badge, DateBlock, Meter, PageHead, QR, SportMark, TileHead, Who, dayOf, evStart, fmtDay, fmtTime, isoOf,
  money, countdown, nameOf, openId, relDay, toast, todayIso, upcoming, nextFor, Tabs, Empty,
} from './ui';


/* ---------------- Home ---------------- */

export function Home() {
  const [next, ...later] = upcoming();
  const weekStart = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - TODAY.getDay());
  const week = Array.from({ length: 7 }, (_, i) => isoOf(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i)));
  const activeTeams = teams.filter(t => t.active);
  const upcomingRes = reservations.filter(r => dayOf(r.date) >= dayOf(todayIso) && r.status !== 'Cancelled');
  const activePasses = passes.filter(p => p.active);
  const family = accounts[0];

  return (
    <div className="page">
      <PageHead
        title={`Good afternoon, ${me.first}`}
        lede={fmtDay(todayIso, { weekday: 'long', month: 'long', day: 'numeric' })}
      />

      <div className="bento">
        <section className="tile tile-navy span-8 nextup" aria-labelledby="nextup-h">
          <div className="tile-head">
            <h2 id="nextup-h">Next up</h2>
            <span className="pill-on-dark">{countdown(next.date)}</span>
          </div>
          <div className="nextup-main">
            <div className="nextup-time">
              <span className="nt-day">{fmtDay(next.date, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <span className="nt-clock">{fmtTime(next.start)}</span>
            </div>
            <div className="nextup-info">
              <p className="nextup-title">{next.title}</p>
              <p className="nextup-meta"><MapPin size={16} />{next.where}</p>
              <p className="nextup-meta">{nameOf(next.who)} · {next.type}</p>
            </div>
          </div>
          <div className="nextup-actions">
            <button className="btn btn-on-dark" onClick={() => toast('Opening directions to ' + next.where)}><Navigation size={16} />Directions</button>
            <button className="btn btn-ghost-dark" onClick={() => toast('Added to your calendar')}><CalendarPlus size={16} />Add to calendar</button>
          </div>
          <ul className="nextup-later">
            {later.slice(0, 3).map(e => (
              <li key={e.date + e.start}>
                <span className="nl-when">{fmtDay(e.date)} · {fmtTime(e.start)}</span>
                <span className="nl-title">{e.title}</span>
                <span className="nl-who">{nameOf(e.who)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="tile span-4 wallet" aria-labelledby="id-h">
          <TileHead title="My Bond ID" />
          <div className="idtile-body">
            <QR seed={me.memberId} size={84} />
            <div>
              <p id="id-h" className="idtile-num">{me.memberId}</p>
            </div>
          </div>
          <button className="btn btn-secondary btn-block" onClick={openId}><IdCard size={18} />See my ID</button>
          <div className="credit-panel">
            <div className="credit-row">
              <span className="credit-label">Account credit</span>
              <a className="tile-link" href="#/settings/history">Activity<ArrowRight size={16} /></a>
            </div>
            <p className="wallet-amount"><span>{money(balance.credit)}</span> available</p>
          </div>
        </section>

        <section className="tile span-12" aria-labelledby="week-h">
          <div className="tile-head">
            <h2 id="week-h">This week <span className="tile-sub">{fmtDay(week[0], { month: 'short', day: 'numeric' })} – {fmtDay(week[6], { month: 'short', day: 'numeric' })}</span></h2>
            <a className="tile-link" href="#/schedule">Open calendar<ArrowRight size={16} /></a>
          </div>
          <div className="week">
            {week.map(day => {
              const list = events.filter(e => e.date === day);
              const past = dayOf(day) < dayOf(todayIso);
              return (
                <div key={day} className="week-day" data-today={day === todayIso} data-past={past}>
                  <span className="wd-name">{fmtDay(day, { weekday: 'short' })}</span>
                  <span className="wd-num">{dayOf(day).getDate()}{dayOf(day).getDate() === 1 && <small>{fmtDay(day, { month: 'short' })}</small>}</span>
                  <div className="wd-events">
                    {list.map(e => (
                      <span key={e.start + e.title} className="wd-event" style={{ '--c': people[e.who].color }} title={`${fmtTime(e.start)} ${e.title}`}>
                        <b>{fmtTime(e.start).replace(':00', '')}</b>
                        <span>{e.title}</span>
                      </span>
                    ))}
                    {!list.length && <span className="wd-free">No events</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        <section className="tile span-4" aria-labelledby="teams-h">
          <div className="tile-head"><h2 id="teams-h">My teams <span className="count">{activeTeams.length}</span></h2><a className="tile-link" href="#/teams">All<ArrowRight size={16} /></a></div>
          <ul className="rows">
            {activeTeams.map(t => {
              const n = nextFor(t.id);
              return (
                <li key={t.id} className="row">
                  <SportMark sport={t.sport} />
                  <div className="row-main">
                    <a className="row-title team-link" href={`#/teams/${t.id}`}>{t.name}</a>
                    <p className="row-sub">{n ? `${relDay(n.date)} · ${fmtTime(n.start)}` : t.program}</p>
                  </div>
                  <Who who={t.who} />
                </li>
              );
            })}
          </ul>
        </section>

        <section className="tile span-4" aria-labelledby="res-h">
          <div className="tile-head"><h2 id="res-h">Reservations <span className="count">{upcomingRes.length}</span></h2><a className="tile-link" href="#/reservations">All<ArrowRight size={16} /></a></div>
          <ul className="rows">
            {upcomingRes.map(r => (
              <li key={r.id} className="row">
                <DateBlock iso={r.date} />
                <div className="row-main">
                  <p className="row-title">{r.title}</p>
                  <p className="row-sub">{fmtTime(r.start)} – {fmtTime(r.end)}</p>
                </div>
                <Who who={r.who} />
              </li>
            ))}
          </ul>
        </section>

        <section className="tile span-4" aria-labelledby="pass-h">
          <div className="tile-head"><h2 id="pass-h">Passes <span className="count">{activePasses.length}</span></h2><a className="tile-link" href="#/passes">All<ArrowRight size={16} /></a></div>
          <ul className="rows">
            {activePasses.map(p => (
              <li key={p.id} className="row row-stack">
                <div className="row-line">
                  <p className="row-title">{p.name}</p>
                  <span className="row-figure">{p.type === 'punch' ? `${p.total - p.used} left` : `Renews ${fmtDay(p.renews, { month: 'short', day: 'numeric' })}`}</span>
                </div>
                {p.type === 'punch' && <Meter value={p.total - p.used} max={p.total} label={`${p.name} visits left`} />}
              </li>
            ))}
          </ul>
        </section>

        <section className="tile span-12 household" aria-labelledby="hh-h">
          <div className="household-top">
            <div className="household-title">
              <h2 id="hh-h">{family.name}</h2>
            </div>
            <a className="btn btn-secondary btn-sm" href="#/settings/accounts"><Users size={16} />Manage members</a>
          </div>
          <ul className="household-people">
            {family.members.map(m => (
              <li key={m.id}>
                <Avatar who={m.id} size={48} />
                <span className="hp-text">
                  <strong>{nameOf(m.id)}</strong>
                  <small>{m.role}</small>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* ---------------- Schedule ---------------- */

const FILTERABLE = ['jordan', 'maya', 'leo'];

export function Schedule() {
  const [month, setMonth] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const [sel, setSel] = useState(todayIso);
  const [who, setWho] = useState(FILTERABLE);
  const shown = events.filter(e => who.includes(e.who));

  const offset = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }, (_, i) =>
    isoOf(new Date(month.getFullYear(), month.getMonth(), i - offset + 1)));
  const shift = n => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  const toggle = id => setWho(w => (w.includes(id) ? w.filter(x => x !== id) : [...w, id]));
  const dayEvents = shown.filter(e => e.date === sel);
  const dayRef = useRef();
  const [openEv, setOpenEv] = useState(null);
  const stepDay = n => { const d = dayOf(sel); d.setDate(d.getDate() + n); setSel(isoOf(d)); setOpenEv(null); };

  return (
    <div className="page page-schedule">
      <PageHead title="My schedule">
        <div className="filters" role="group" aria-label="Show events for">
          {FILTERABLE.map(id => (
            <button key={id} className="chip" aria-pressed={who.includes(id)} style={{ '--c': people[id].color }} onClick={() => toggle(id)}>
              <span className="chip-dot" />{nameOf(id)}
            </button>
          ))}
        </div>
      </PageHead>
      <section className="tile cal" aria-label="Calendar">
        <div className="cal-head">
          <h2>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <div className="cal-nav">
            <button className="btn btn-secondary btn-sm" onClick={() => { setMonth(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)); setSel(todayIso); }}>Today</button>
            <button className="icon-btn" aria-label="Previous month" onClick={() => shift(-1)}><ChevronLeft size={20} /></button>
            <button className="icon-btn" aria-label="Next month" onClick={() => shift(1)}><ChevronRight size={20} /></button>
          </div>
        </div>
        <div className="cal-grid" role="grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d} className="cal-dow" role="columnheader">{d}</span>)}
          {cells.map(day => {
            const list = shown.filter(e => e.date === day);
            const out = dayOf(day).getMonth() !== month.getMonth();
            return (
              <button
                key={day}
                role="gridcell"
                className="cal-cell"
                data-out={out}
                data-today={day === todayIso}
                aria-selected={day === sel}
                aria-label={`${fmtDay(day, { weekday: 'long', month: 'long', day: 'numeric' })}, ${list.length} events`}
                onClick={() => { setSel(day); setOpenEv(null); dayRef.current.showModal(); }}
              >
                <span className="cal-num">{dayOf(day).getDate()}</span>
                <span className="cal-events">
                  {list.slice(0, 2).map(e => (
                    <span key={e.start + e.title} className="cal-event" style={{ '--c': people[e.who].color }} title={`${fmtTime(e.start)} ${e.title}`}>
                      {e.title}
                    </span>
                  ))}
                  {list.length > 2 && <span className="cal-more">+{list.length - 2} more</span>}
                </span>
                <span className="cal-dots" aria-hidden="true">
                  {list.map(e => <i key={e.start + e.title} style={{ '--c': people[e.who].color }} />)}
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <dialog ref={dayRef} className="day-dialog" aria-labelledby="day-h" onClick={e => e.target === dayRef.current && dayRef.current.close()}>
        <div className="day-card">
          <div className="day-head">
            <button className="icon-btn" aria-label="Previous day" onClick={() => stepDay(-1)}><ChevronLeft size={20} /></button>
            <h2 id="day-h">{fmtDay(sel, { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
            <button className="icon-btn" aria-label="Next day" onClick={() => stepDay(1)}><ChevronRight size={20} /></button>
            <button className="icon-btn day-close" aria-label="Close" onClick={() => dayRef.current.close()}><X size={20} /></button>
          </div>
          {dayEvents.length ? (
            <ul className="day-list">
              {dayEvents.map(e => {
                const key = e.start + e.title;
                const open = openEv === key;
                return (
                  <li key={key} data-open={open}>
                    <button className="day-row" aria-expanded={open} onClick={() => setOpenEv(open ? null : key)}>
                      <p className="day-time">{fmtTime(e.start)}<span>{fmtTime(e.end)}</span></p>
                      <div className="day-info">
                        <p className="row-title">{e.title}</p>
                        <p className="row-sub"><MapPin size={14} />{e.where}</p>
                      </div>
                      <div className="day-meta"><Who who={e.who} /><Badge tone={e.type === 'Game' ? 'gold' : 'neutral'}>{e.type}</Badge></div>
                    </button>
                    {open && <EventDetail e={e} />}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="day-empty"><CalendarDays size={18} />No events on this day</p>
          )}
        </div>
      </dialog>
    </div>
  );
}

function EventDetail({ e }) {
  const arrive = e.arrive && fmtTime(new Date(evStart(e) - e.arrive * 6e4).toTimeString().slice(0, 5));
  const facts = [
    e.home != null && ['Side', e.home ? 'Home' : 'Away'],
    arrive && ['Arrive by', arrive],
    e.res && ['Price', e.res.price ? money(e.res.price) : 'Pass'],
    e.res && ['Status', e.res.status],
  ].filter(Boolean);
  return (
    <div className="ev-detail">
      {facts.length > 0 && (
        <dl className="ev-facts">
          {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      )}
      {(e.note || e.res?.note) && <p className="ev-note">{e.note || e.res.note}</p>}
      <div className="ev-actions">
        <button className="btn btn-secondary btn-sm" onClick={() => toast(`Opening directions to ${e.where}`)}><Navigation size={16} />Directions</button>
        <button className="btn btn-secondary btn-sm" onClick={() => toast('Added to your calendar')}><CalendarPlus size={16} />Add to calendar</button>
        {e.team && <a className="btn btn-quiet btn-sm" href={`#/teams/${e.team}`}>View team<ArrowRight size={16} /></a>}
        {e.res && <a className="btn btn-quiet btn-sm" href="#/reservations">View reservation<ArrowRight size={16} /></a>}
      </div>
    </div>
  );
}

/* ---------------- Reservations ---------------- */

export function Reservations() {
  const [tab, setTab] = useState('upcoming');
  const [list, setList] = useState(reservations);
  const isUpcoming = r => dayOf(r.date) >= dayOf(todayIso) && r.status !== 'Cancelled';
  const up = list.filter(isUpcoming);
  const past = list.filter(r => !isUpcoming(r));
  const shown = tab === 'upcoming' ? up : past;
  const cancel = r => {
    setList(l => l.map(x => (x.id === r.id ? { ...x, status: 'Cancelled' } : x)));
    toast(`${r.title} cancelled. Refunds go back to the original payment method.`);
  };
  return (
    <div className="page">
      <PageHead title="Reservations" />
      <Tabs label="Reservation status" value={tab} onChange={setTab} tabs={[['upcoming', 'Upcoming', up.length], ['past', 'Past', past.length]]} />
      <div className="stack">
        {shown.map(r => (
          <article key={r.id} className="tile res" data-inactive={tab === 'past'}>
            <DateBlock iso={r.date} tone={tab === 'upcoming' ? 'gold' : undefined} />
            <div className="res-main">
              <h2>{r.title}</h2>
              <p className="row-sub"><span className="meta"><Clock size={14} />{fmtDay(r.date, { weekday: 'long' })} · {fmtTime(r.start)} – {fmtTime(r.end)}</span><span className="dot-sep" /><span className="meta"><MapPin size={14} />{r.where}</span></p>
              {r.note && <p className={`res-note ${r.due ? 'res-note-due' : ''}`}>{r.note}</p>}
            </div>
            <div className="res-side">
              <Who who={r.who} />
              {r.price ? <span className="num res-price">{money(r.price)}</span> : <span className="res-price res-price-pass">Covered by pass</span>}
              <Badge tone={r.status === 'Confirmed' ? 'green' : r.status === 'Deposit paid' ? 'gold' : r.status === 'Cancelled' ? 'red' : 'neutral'}>{r.status}</Badge>
            </div>
            {tab === 'upcoming' && (
              <div className="res-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => toast('Added to your calendar')}><CalendarPlus size={16} />Add to calendar</button>
                <button className="btn btn-quiet btn-sm" onClick={() => cancel(r)}>Cancel</button>
              </div>
            )}
          </article>
        ))}
        {!shown.length && <Empty icon={MapPin} title="No upcoming reservations">Bookings made with your facility show up here.</Empty>}
      </div>
    </div>
  );
}

/* ---------------- Passes ---------------- */

const PASS_ICON = { gym: Dumbbell, pool: WavesLadder, cage: Target, camp: TentTree, court: Ticket };
const PassIcon = ({ kind }) => { const Icon = PASS_ICON[kind]; return <Icon size={20} />; };

export function Passes() {
  const [tab, setTab] = useState('active');
  const active = passes.filter(p => p.active);
  const expired = passes.filter(p => !p.active);
  const shown = tab === 'active' ? active : expired;
  return (
    <div className="page">
      <PageHead title="Passes">
        <button className="btn btn-secondary" onClick={openId}><IdCard size={18} />Show at check-in</button>
      </PageHead>
      <Tabs label="Pass status" value={tab} onChange={setTab} tabs={[['active', 'Active', active.length], ['expired', 'Expired', expired.length]]} />
      <div className="grid-cards">
        {shown.map(p => (
          <article key={p.id} className="tile pass" data-inactive={!p.active}>
            <div className="pass-top">
              <span className="pass-icon"><PassIcon kind={p.kind} /></span>
              <Badge tone={p.active ? 'green' : 'neutral'}>{p.active ? 'Active' : p.reason}</Badge>
            </div>
            <h2>{p.name}</h2>
            <Who who={p.who} />
            {p.type === 'punch' && (
              <div className="pass-meter">
                <p><strong className="num">{p.total - p.used}</strong> of {p.total} visits left</p>
                <Meter value={p.total - p.used} max={p.total} label="Visits left" />
              </div>
            )}
            {p.type === 'membership' && (
              <div className="pass-meter">
                <p><strong className="num">{money(p.price)}</strong> / month</p>
                <p className="muted small">Renews {fmtDay(p.renews, { month: 'long', day: 'numeric' })}</p>
              </div>
            )}
            <div className="pass-foot">
              <span className="muted small">{p.active ? (p.expires ? `Expires ${fmtDay(p.expires, { month: 'short', day: 'numeric', year: 'numeric' })}` : 'Auto-renews monthly') : `Ended ${fmtDay(p.expires, { month: 'short', day: 'numeric', year: 'numeric' })}`}</span>
              {!p.active && <button className="btn btn-secondary btn-sm" onClick={() => toast(`${p.name} added to cart`)}><RotateCcw size={16} />Buy again</button>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
