import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { TODAY, events, people, rosters, standings, teams } from './data';
import {
  Avatar, Badge, DateBlock, PageHead, SportMark, Tabs, Who, evStart, fmtDay, fmtTime, nextFor, relDay, toast,
} from './ui';

const ordinal = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 > 10 && n % 100 < 14) || n % 10 > 3 ? 0 : n % 10]);
const POSITIONS = {
  GK: 'Goalkeeper', DEF: 'Defender', MID: 'Midfielder', FWD: 'Forward', P: 'Pitcher', C: 'Catcher', '1B': 'First base',
  '2B': 'Second base', '3B': 'Third base', SS: 'Shortstop', LF: 'Left field', CF: 'Center field', RF: 'Right field', EH: 'Extra hitter', UT: 'Utility',
};

function Record({ team: t }) {
  if (!t.stats) return <p className="record-none"><span><strong>Clinic</strong> · skills sessions, no scores or standings kept</span></p>;
  const { w, l, t: ties } = t.stats;
  return (
    <div className="record">
      <div className="rec-group" aria-label={`Record: ${w} wins, ${l} losses${ties != null ? `, ${ties} ties` : ''}`}>
        <div className="rec"><b>{w}</b><span>Wins</span></div>
        <div className="rec"><b>{l}</b><span>Losses</span></div>
        {ties != null && <div className="rec"><b>{ties}</b><span>Ties</span></div>}
      </div>
      <div className="rec rec-place"><b>{ordinal(t.rank)}</b><span>{t.champions ? <><Trophy size={12} />Champions</> : `of ${t.of} ${t.unit}`}</span></div>
    </div>
  );
}

function TeamTitle({ team: t, link, children }) {
  const ended = !t.active && ` · ended ${fmtDay(t.ended, { month: 'short', year: 'numeric' })}`;
  return (
    <div className="team-top">
      <SportMark sport={t.sport} />
      <div className="team-head">
        {link ? <h2><a href={`#/teams/${t.id}`} className="team-link">{t.name}</a></h2> : <h1>{t.name}</h1>}
        <p className="muted">{t.program}{ended}</p>
      </div>
      {children}
    </div>
  );
}

function TeamMeta({ team: t }) {
  return (
    <div className="team-meta">
      <span className="team-meta-item"><span className="muted">{t.who === 'jordan' ? 'Playing' : 'Player'}</span><Who who={t.who} /></span>
      <span className="team-meta-item"><span className="muted">{t.coachRole || 'Coach'}</span><strong>{t.coach}</strong></span>
    </div>
  );
}

function TeamNext({ event: n, href }) {
  const Tag = href ? 'a' : 'div';
  return (
    <Tag className={`team-next ${href ? 'team-next-panel' : ''}`} href={href}>
      <DateBlock iso={n.date} tone="gold" />
      <div>
        <p className="row-title">{n.title}</p>
        <p className="row-sub">{relDay(n.date)} · {fmtTime(n.start)} · {n.where}</p>
      </div>
      {href && <ChevronRight size={18} className="team-next-go" />}
    </Tag>
  );
}

export function Teams({ route }) {
  const [, , id, section] = route.split('/');
  const [tab, setTab] = useState('active');
  const team = teams.find(t => t.id === id);
  if (team) return <TeamDetail team={team} section={section} />;

  const active = teams.filter(t => t.active);
  const past = teams.filter(t => !t.active);
  const list = tab === 'active' ? active : past;
  return (
    <div className="page">
      <PageHead title="My teams" />
      <Tabs label="Team status" value={tab} onChange={setTab} tabs={[['active', 'Active', active.length], ['past', 'Past', past.length]]} />
      <div className="grid-cards">
        {list.map(t => {
          const n = nextFor(t.id);
          return (
            <article key={t.id} className="tile team" data-inactive={!t.active}>
              <TeamTitle team={t} link />
              <Record team={t} />
              <TeamMeta team={t} />
              {n && <TeamNext event={n} />}
              <div className="team-foot">
                {t.stats && <a className="btn btn-secondary btn-sm" href={`#/teams/${t.id}/standings`}>Standings</a>}
                <a className="btn btn-secondary btn-sm" href={`#/teams/${t.id}/roster`}>Roster</a>
                {t.active && <a className="btn btn-secondary btn-sm" href={`#/teams/${t.id}/schedule`}>Schedule</a>}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function TeamDetail({ team: t, section }) {
  const table = standings[t.id];
  const roster = rosters[t.id];
  const tabs = [
    ...(table ? [['standings', 'Standings']] : []),
    ['roster', 'Roster', roster.players.length],
    ...(t.active ? [['schedule', 'Schedule']] : []),
  ];
  const current = tabs.some(([k]) => k === section) ? section : tabs[0][0];
  const next = nextFor(t.id);
  return (
    <div className="page">
      <a className="back" href="#/teams"><ChevronLeft size={18} />My teams</a>
      <section className="tile team-hero">
        <TeamTitle team={t}>
          <TeamMeta team={t} />
        </TeamTitle>
        <div className="team-hero-row">
          <Record team={t} />
          {next && <TeamNext event={next} href={`#/teams/${t.id}/schedule`} />}
        </div>
      </section>
      <Tabs label="Team details" value={current} onChange={k => { location.hash = `/teams/${t.id}/${k}`; }} tabs={tabs} />
      {current === 'standings' && <StandingsTable team={t} rows={table} />}
      {current === 'roster' && <Roster team={t} roster={roster} />}
      {current === 'schedule' && <TeamSchedule team={t} />}
    </div>
  );
}

function StandingsTable({ team: t, rows }) {
  const soccer = t.sport === 'Soccer';
  const ladder = t.unit === 'players';
  const [, lw, ll] = rows[0];
  const data = rows.map(([name, w, l, ties = 0]) => ({
    name, w, l, ties, gp: w + l + ties, pts: 3 * w + ties, pct: w / (w + l), gb: (lw - w + (l - ll)) / 2,
  }));
  const isMine = name => name === t.name || (ladder && name === people[t.who].name);
  return (
    <section className="tile">
      <div className="tile-head">
        <h2>{ladder ? `Ladder · top ${rows.length} of ${t.of}` : 'League table'}</h2>
        <span className="muted small">{soccer ? 'Win = 3 pts · Tie = 1 pt' : 'Ranked by win %'}</span>
      </div>
      <div className="table-scroll">
        <table className="table standings">
          <thead>
            <tr>
              <th>#</th><th>{ladder ? 'Player' : 'Team'}</th>
              <th className="t-right" title="Games played">GP</th>
              <th className="t-right" title="Wins">W</th>
              <th className="t-right" title="Losses">L</th>
              {soccer && <th className="t-right" title="Ties">T</th>}
              <th className="t-right" title={soccer ? 'Points' : 'Win percentage'}>{soccer ? 'PTS' : 'PCT'}</th>
              {!soccer && !ladder && <th className="t-right" title="Games behind the leader">GB</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={r.name} data-mine={isMine(r.name)}>
                <td className="num st-rank">{i + 1}</td>
                <td className="st-team">{r.name}{isMine(r.name) && <span className="you-tag">{ladder ? 'You' : 'Your team'}</span>}</td>
                <td className="num t-right">{r.gp}</td>
                <td className="num t-right">{r.w}</td>
                <td className="num t-right">{r.l}</td>
                {soccer && <td className="num t-right">{r.ties}</td>}
                <td className="num t-right st-key">{soccer ? r.pts : r.pct.toFixed(3).replace(/^0/, '')}</td>
                {!soccer && !ladder && <td className="num t-right">{r.gb === 0 ? '–' : r.gb}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="legend">
        GP games played · W wins · L losses{soccer ? ' · T ties · PTS points' : ' · PCT win percentage'}{!soccer && !ladder ? ' · GB games behind the leader' : ''}
      </p>
    </section>
  );
}

function Roster({ team: t, roster }) {
  const youthTeam = roster.players.some(p => /^\S+ [A-Z]\.$/.test(p.name));
  const positions = [...new Set(roster.players.map(p => p.pos).filter(Boolean))];
  return (
    <div className="stack">
      <section className="tile">
        <div className="tile-head">
          <h2>{t.unit === 'players' ? 'Participants' : 'Players'}</h2>
          <span className="muted small">{roster.players.length} total</span>
        </div>
        <ul className="roster">
          {roster.players.map(p => {
            const mine = p.name === roster.family;
            return (
              <li key={p.name} data-mine={mine}>
                <span className={`jersey ${p.num == null ? 'jersey-initials' : ''}`}>{p.num ?? p.name.split(' ').map(w => w[0]).join('')}</span>
                <span className="roster-name">
                  {p.name}
                  {mine && <small className="roster-mine">{t.who === 'jordan' ? 'You' : 'Your player'}</small>}
                </span>
                {p.pos && <span className="roster-pos" title={POSITIONS[p.pos]}>{p.pos}</span>}
              </li>
            );
          })}
        </ul>
        {(positions.length > 0 || youthTeam) && (
          <p className="legend">
            {positions.map(k => `${k} ${POSITIONS[k].toLowerCase()}`).join(' · ')}
            {youthTeam && <>{positions.length > 0 && <br />}Youth rosters show first name and last initial only.</>}
          </p>
        )}
      </section>
      <section className="tile">
        <div className="tile-head"><h2>Coaches & staff</h2></div>
        <ul className="rows">
          {roster.staff.map(([name, role]) => (
            <li key={name} className="row">
              <Avatar person={{ name, color: '#5F82AD' }} size={36} />
              <div className="row-main">
                <p className="row-title">{name}</p>
                <p className="row-sub">{role}</p>
              </div>
              {t.active && name !== people[t.who].name && (
                <button className="btn btn-quiet btn-sm" onClick={() => toast(`Message sent to ${name}`)}>Message</button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function TeamSchedule({ team: t }) {
  const list = events.filter(e => e.team === t.id && evStart(e) >= TODAY).slice(0, 8);
  return (
    <section className="tile">
      <div className="tile-head">
        <h2>Coming up</h2>
        <a className="tile-link" href="#/schedule">Family calendar<ArrowRight size={16} /></a>
      </div>
      <ul className="rows">
        {list.map(e => (
          <li key={e.date + e.start} className="row">
            <DateBlock iso={e.date} tone={e.type === 'Game' ? 'gold' : undefined} />
            <div className="row-main">
              <p className="row-title">{e.title}</p>
              <p className="row-sub">{relDay(e.date)} · {fmtTime(e.start)} – {fmtTime(e.end)} · {e.where}</p>
            </div>
            <Badge tone={e.type === 'Game' ? 'gold' : 'neutral'}>{e.type}</Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
