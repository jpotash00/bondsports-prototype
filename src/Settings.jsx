import { useState } from 'react';
import {
  IdCard, Pencil, Check, UserPlus, CreditCard, Landmark, Plus, Search, Download, Receipt,
  ShieldCheck, Building2, Users, X,
} from 'lucide-react';
import { accounts as seedAccounts, balance, me, paymentMethods, people, purchases } from './data';
import { Avatar, Badge, Empty, Who, ageOf, nameOf, fmtDay, money, openId, toast } from './ui';

const TABS = [
  ['profile', 'Profile'],
  ['accounts', 'Account members'],
  ['payments', 'Payment methods'],
  ['history', 'Purchase history'],
];

export default function Settings({ tab }) {
  return (
    <div className="page">
      <section className="tile profile-hero">
        <Avatar who="jordan" size={72} />
        <div className="ph-main">
          <h1>{me.first} {me.last}</h1>
          <p className="muted">Primary member · Rivera Family</p>
        </div>
        <div className="ph-balance">
          <div><strong className="num">{money(balance.credit)}</strong><span>credit</span></div>
        </div>
        <button className="btn btn-secondary" onClick={openId}><IdCard size={18} />See my ID</button>
      </section>

      <nav className="tabs tabs-wide" aria-label="Settings sections">
        {TABS.map(([key, label]) => (
          <a key={key} className="tab" href={`#/settings/${key}`} aria-current={tab === key ? 'page' : undefined}>{label}</a>
        ))}
      </nav>

      {tab === 'profile' && <Profile />}
      {tab === 'accounts' && <Accounts />}
      {tab === 'payments' && <Payments />}
      {tab === 'history' && <History />}
    </div>
  );
}

function Field({ label, children, hint, wide }) {
  return (
    <label className={`field ${wide ? 'field-wide' : ''}`}>
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

/* ---------------- Profile ---------------- */

function Profile() {
  const [dirty, setDirty] = useState(false);
  const save = e => { e.preventDefault(); setDirty(false); toast('Profile saved'); };
  return (
    <form className="tile form-tile" onChange={() => setDirty(true)} onSubmit={save}>
      <div className="form-section">
        <h2>Personal details</h2>
        <div className="form-grid">
          <Field label="First name"><input defaultValue={me.first} autoComplete="given-name" required /></Field>
          <Field label="Last name"><input defaultValue={me.last} autoComplete="family-name" required /></Field>
          <Field label="Date of birth"><input type="date" defaultValue={me.dob} autoComplete="bday" /></Field>
          <Field label="Gender">
            <select defaultValue={me.gender}>
              <option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option>
            </select>
          </Field>
        </div>
      </div>
      <div className="form-section">
        <h2>Contact</h2>
        <div className="form-grid">
          <Field label="Email"><input type="email" defaultValue={me.email} autoComplete="email" required /></Field>
          <Field label="Phone"><input type="tel" defaultValue={me.phone} autoComplete="tel" /></Field>
          <Field label="Street address" wide><input defaultValue={me.street} autoComplete="street-address" /></Field>
          <Field label="City"><input defaultValue={me.city} autoComplete="address-level2" /></Field>
          <div className="form-grid-2">
            <Field label="State"><input defaultValue={me.state} autoComplete="address-level1" /></Field>
            <Field label="ZIP"><input defaultValue={me.zip} autoComplete="postal-code" inputMode="numeric" /></Field>
          </div>
        </div>
      </div>
      <div className="form-section">
        <h2>Role</h2>
        <p className="role-line">
          <Badge tone="blue"><ShieldCheck size={14} />{me.role}</Badge>
          <span className="muted">You can edit everyone on the Rivera Family account and add new members.</span>
        </p>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" disabled={!dirty}>Save changes</button>
      </div>
    </form>
  );
}

/* ---------------- Accounts ---------------- */

const blankMember = { first: '', last: '', dob: '', role: 'Dependent', email: '' };

function Accounts() {
  const [accounts, setAccounts] = useState(seedAccounts);
  const [viewer, setViewer] = useState('jordan'); // demo: preview the permission model
  const [adding, setAdding] = useState(null); // account id
  const [form, setForm] = useState(blankMember);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // `${accountId}:${memberId}`
  const [creating, setCreating] = useState(false);
  const [newAcc, setNewAcc] = useState({ type: '', name: '' });
  const mine = accounts.filter(a => a.members.some(m => m.id === viewer));
  const openTypes = ['Family', 'Business'].filter(t => !mine.some(a => a.type === t)); // max one of each

  const viewerRole = acc => acc.members.find(m => m.id === viewer)?.role;

  const addMember = (e, accId) => {
    e.preventDefault();
    if (!form.first.trim() || !form.last.trim()) return setError('Enter a first and last name.');
    if (form.role === 'Primary' && !/^\S+@\S+\.\S+$/.test(form.email)) return setError('Primary members need an email address so they can sign in.');
    const id = `m${Date.now()}`;
    const member = { id, name: `${form.first.trim()} ${form.last.trim()}`, role: form.role, email: form.email, dob: form.dob, color: '#6F8FB3' };
    setAccounts(list => list.map(a => (a.id === accId ? { ...a, members: [...a.members, member] } : a)));
    setAdding(null); setForm(blankMember); setError('');
    toast(`${member.name} added as ${form.role.toLowerCase()}`);
  };

  const saveEdit = (accId, memberId, changes) => {
    setAccounts(list => list.map(a => (a.id !== accId ? a : { ...a, members: a.members.map(m => (m.id === memberId ? { ...m, ...changes } : m)) })));
    setEditing(null);
    toast('Member updated');
  };

  const createAccount = e => {
    e.preventDefault();
    const type = newAcc.type || openTypes[0];
    if (!newAcc.name.trim()) return;
    const self = accounts.flatMap(a => a.members).find(m => m.id === viewer);
    setAccounts(list => [...list, { id: `acc${Date.now()}`, type, name: newAcc.name.trim(), members: [{ ...self, role: 'Primary' }] }]);
    setCreating(false); setNewAcc({ type: '', name: '' });
    toast(`${newAcc.name.trim()} created`);
  };

  return (
    <div className="stack">
      <div className="tile preview-bar">
        <p><strong>Preview permissions as</strong><span className="muted"> · demo only</span></p>
        <div className="seg">
          <button aria-pressed={viewer === 'jordan'} onClick={() => setViewer('jordan')}>Jordan · Primary</button>
          <button aria-pressed={viewer === 'maya'} onClick={() => setViewer('maya')}>Maya · Dependent</button>
        </div>
      </div>

      {accounts.map(acc => {
        const role = viewerRole(acc);
        if (!role) return null;
        const isPrimary = role === 'Primary';
        return (
          <section key={acc.id} className="tile account">
            <div className="account-head">
              <span className="account-icon">{acc.type === 'Family' ? <Users size={22} /> : <Building2 size={22} />}</span>
              <div>
                <h2>{acc.name}</h2>
                <p className="muted">{acc.type} account</p>
              </div>
              {isPrimary && adding !== acc.id && (
                <button className="btn btn-secondary btn-sm" onClick={() => { setAdding(acc.id); setError(''); }}><UserPlus size={16} />Add member</button>
              )}
            </div>

            {!isPrimary && (
              <p className="notice">You're a dependent on this account, so you can update your own details. Ask a primary member to make other changes.</p>
            )}

            <ul className="members">
              {acc.members.map(m => {
                const key = `${acc.id}:${m.id}`;
                const canEdit = isPrimary || m.id === viewer;
                return (
                  <li key={m.id} className="member">
                    <Avatar person={m} size={40} />
                    {editing === key ? (
                      <EditMember
                        member={m}
                        canChangeRole={isPrimary}
                        lastPrimary={m.role === 'Primary' && acc.members.filter(x => x.role === 'Primary').length === 1}
                        onCancel={() => setEditing(null)}
                        onSave={changes => saveEdit(acc.id, m.id, changes)}
                      />
                    ) : (
                      <>
                        <div className="member-main">
                          <p className="row-title">{m.name}{m.id === viewer && <span className="you-tag">You</span>}</p>
                          <p className="row-sub">{m.email || 'No email'}{m.dob && ` · ${ageOf(m.dob)} yrs`}</p>
                        </div>
                        <Badge tone={m.role === 'Primary' ? 'blue' : 'neutral'}>{m.role}</Badge>
                        {canEdit
                          ? <button className="icon-btn" aria-label={`Edit ${m.name}`} onClick={() => setEditing(key)}><Pencil size={16} /></button>
                          : <span className="icon-btn-spacer" />}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>

            {adding === acc.id && (
              <form className="add-member" onSubmit={e => addMember(e, acc.id)} noValidate>
                <h3>Add a member to {acc.name}</h3>
                <div className="form-grid">
                  <Field label="First name"><input value={form.first} onChange={e => setForm({ ...form, first: e.target.value })} autoFocus /></Field>
                  <Field label="Last name"><input value={form.last} onChange={e => setForm({ ...form, last: e.target.value })} /></Field>
                  <Field label="Date of birth"><input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></Field>
                  <Field label="Role" hint={form.role === 'Primary' ? 'Can edit everyone and add members.' : 'Can only edit their own details.'}>
                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                      <option>Dependent</option><option>Primary</option>
                    </select>
                  </Field>
                  <Field label={form.role === 'Primary' ? 'Email (required)' : 'Email (optional)'} wide>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} aria-invalid={!!error && form.role === 'Primary'} />
                  </Field>
                </div>
                {error && <p className="form-error" role="alert">{error}</p>}
                <div className="form-actions">
                  <button type="button" className="btn btn-quiet" onClick={() => { setAdding(null); setError(''); }}>Cancel</button>
                  <button className="btn btn-primary">Add member</button>
                </div>
              </form>
            )}
          </section>
        );
      })}

      {openTypes.length > 0 && (creating ? (
        <form className="tile create-account" onSubmit={createAccount}>
          <div className="tile-head">
            <h2>New account</h2>
            <button type="button" className="icon-btn" aria-label="Close" onClick={() => setCreating(false)}><X size={18} /></button>
          </div>
          <div className="form-grid">
            <Field label="Type">
              <select value={newAcc.type || openTypes[0]} onChange={e => setNewAcc({ ...newAcc, type: e.target.value })}>
                {['Family', 'Business'].map(t => <option key={t} disabled={!openTypes.includes(t)}>{t}{openTypes.includes(t) ? '' : ' (you have one)'}</option>)}
              </select>
            </Field>
            <Field label="Account name">
              <input value={newAcc.name} onChange={e => setNewAcc({ ...newAcc, name: e.target.value })} placeholder={(newAcc.type || openTypes[0]) === 'Business' ? 'e.g. Alder Street Design Co.' : 'e.g. Rivera Family'} autoFocus required />
            </Field>
          </div>
          <div className="form-actions form-actions-flat">
            <button type="button" className="btn btn-quiet" onClick={() => setCreating(false)}>Cancel</button>
            <button className="btn btn-primary">Create account</button>
          </div>
        </form>
      ) : (
        <button className="tile create-account-btn" onClick={() => setCreating(true)}>
          <Plus size={18} />Create {openTypes.length === 1 ? `a ${openTypes[0].toLowerCase()}` : 'an'} account
        </button>
      ))}
    </div>
  );
}

function EditMember({ member, canChangeRole, lastPrimary, onSave, onCancel }) {
  const [name, setName] = useState(member.name);
  const [email, setEmail] = useState(member.email);
  const [role, setRole] = useState(member.role);
  const needsEmail = role === 'Primary' && !/^\S+@\S+\.\S+$/.test(email);
  const error = needsEmail ? 'Primary members need an email.' : lastPrimary && role !== 'Primary' ? 'Each account needs at least one primary member.' : '';
  return (
    <form className="member-edit" onSubmit={e => { e.preventDefault(); if (!error) onSave({ name, email, role }); }}>
      <div className="member-edit-fields">
        <input aria-label="Name" value={name} onChange={e => setName(e.target.value)} autoFocus />
        <input aria-label="Email" type="email" value={email} placeholder={role === 'Primary' ? 'Email (required)' : 'Email (optional)'} onChange={e => setEmail(e.target.value)} aria-invalid={needsEmail} />
        {canChangeRole && (
          <select aria-label="Role" value={role} onChange={e => setRole(e.target.value)}>
            <option>Primary</option><option>Dependent</option>
          </select>
        )}
        <button className="icon-btn icon-btn-solid" aria-label="Save" disabled={!!error}><Check size={16} /></button>
        <button type="button" className="icon-btn" aria-label="Cancel" onClick={onCancel}><X size={16} /></button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}

/* ---------------- Payments ---------------- */

function PayPalMark() {
  return <span className="pm-paypal" aria-hidden="true"><i>Pay</i><b>Pal</b></span>;
}

function Payments() {
  const [methods, setMethods] = useState(paymentMethods);
  const [adding, setAdding] = useState(false);
  const [kind, setKind] = useState('card');

  const makeDefault = id => { setMethods(ms => ms.map(m => ({ ...m, isDefault: m.id === id }))); toast('Default payment method updated'); };
  const remove = id => { setMethods(ms => ms.filter(m => m.id !== id)); toast('Payment method removed'); };
  const addCard = e => {
    e.preventDefault();
    const num = new FormData(e.target).get('number').replace(/\D/g, '');
    setMethods(ms => [...ms, { id: `pm${Date.now()}`, kind: 'card', label: 'Card', last4: num.slice(-4), detail: `Expires ${new FormData(e.target).get('exp')}` }]);
    setAdding(false);
    toast('Card added');
  };

  return (
    <div className="stack">
      <section className="tile">
        <div className="tile-head">
          <h2>Saved methods</h2>
          {!adding && <button className="btn btn-secondary btn-sm" onClick={() => setAdding(true)}><Plus size={16} />Add method</button>}
        </div>
        <ul className="methods">
          {methods.map(m => (
            <li key={m.id} className="method">
              <span className={`pm-icon pm-${m.kind}`}>
                {m.kind === 'card' ? <CreditCard size={20} /> : m.kind === 'bank' ? <Landmark size={20} /> : <PayPalMark />}
              </span>
              <div className="member-main">
                <p className="row-title">{m.label}{m.last4 && <span className="num"> •••• {m.last4}</span>}</p>
                <p className="row-sub">{m.detail}</p>
              </div>
              {m.isDefault ? <Badge tone="green">Default</Badge> : (
                <div className="method-actions">
                  <button className="btn btn-quiet btn-sm" onClick={() => makeDefault(m.id)}>Make default</button>
                  <button className="btn btn-quiet btn-sm" onClick={() => remove(m.id)}>Remove</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {adding && (
        <section className="tile add-method">
          <div className="tile-head">
            <h2>Add a payment method</h2>
            <button className="icon-btn" aria-label="Close" onClick={() => setAdding(false)}><X size={18} /></button>
          </div>
          <div className="seg seg-3" role="tablist">
            <button role="tab" aria-selected={kind === 'card'} aria-pressed={kind === 'card'} onClick={() => setKind('card')}><CreditCard size={16} />Card</button>
            <button role="tab" aria-selected={kind === 'bank'} aria-pressed={kind === 'bank'} onClick={() => setKind('bank')}><Landmark size={16} />Bank (ACH)</button>
            <button role="tab" aria-selected={kind === 'paypal'} aria-pressed={kind === 'paypal'} onClick={() => setKind('paypal')}>PayPal</button>
          </div>

          {kind === 'card' && (
            <form className="form-grid" onSubmit={addCard}>
              <Field label="Name on card" wide><input name="name" autoComplete="cc-name" defaultValue={`${me.first} ${me.last}`} required /></Field>
              <Field label="Card number" wide><input name="number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 1234 1234 1234" pattern="[\d ]{12,23}" required /></Field>
              <Field label="Expiry"><input name="exp" autoComplete="cc-exp" placeholder="MM / YY" required /></Field>
              <div className="form-grid-2">
                <Field label="CVC"><input name="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} required /></Field>
                <Field label="ZIP"><input name="zip" inputMode="numeric" autoComplete="postal-code" defaultValue={me.zip} required /></Field>
              </div>
              <div className="form-actions field-wide"><button className="btn btn-primary">Save card</button></div>
            </form>
          )}
          {kind === 'bank' && (
            <div className="connect">
              <p>Connect your checking or savings account securely with <strong>Link</strong>. Bank payments (ACH) take 3–5 business days to clear and have no card fees.</p>
              <button className="btn btn-link-pay" onClick={() => toast('Opening Link to connect your bank…')}>Connect with Link</button>
            </div>
          )}
          {kind === 'paypal' && (
            <div className="connect">
              <p>You'll sign in to PayPal to approve future payments, then come right back here.</p>
              <button className="btn btn-paypal" onClick={() => toast('Redirecting to PayPal…')}>Continue with <PayPalMark /></button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* ---------------- History ---------------- */

const RANGES = [['30', 'Last 30 days'], ['90', 'Last 90 days'], ['365', 'Last 12 months'], ['all', 'All time']];

function History() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [who, setWho] = useState('all');
  const [range, setRange] = useState('all');
  const cats = [...new Set(purchases.map(p => p.cat))];
  const whos = [...new Set(purchases.map(p => p.who))];
  const cutoff = range === 'all' ? null : new Date(2026, 8, 28 - Number(range));

  const shown = purchases.filter(p =>
    (cat === 'all' || p.cat === cat) &&
    (who === 'all' || p.who === who) &&
    (!cutoff || new Date(`${p.date}T00:00`) >= cutoff) &&
    (p.desc + p.id + p.method).toLowerCase().includes(q.toLowerCase()));
  const total = shown.reduce((s, p) => s + (p.status === 'Paid' ? p.amount : -p.amount), 0);
  const reset = () => { setQ(''); setCat('all'); setWho('all'); setRange('all'); };

  return (
    <section className="tile history">
      <div className="history-filters">
        <label className="search">
          <Search size={18} />
          <input placeholder="Search purchases or receipt #" value={q} onChange={e => setQ(e.target.value)} aria-label="Search purchases" />
        </label>
        <select value={cat} onChange={e => setCat(e.target.value)} aria-label="Category">
          <option value="all">All categories</option>
          {cats.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={who} onChange={e => setWho(e.target.value)} aria-label="Member">
          <option value="all">Everyone</option>
          {whos.map(w => <option key={w} value={w}>{nameOf(w)}</option>)}
        </select>
        <select value={range} onChange={e => setRange(e.target.value)} aria-label="Date range">
          {RANGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <p className="history-summary muted">
        <span className="num">{shown.length}</span> {shown.length === 1 ? 'purchase' : 'purchases'} · <span className="num">{money(total)}</span> net
      </p>

      {shown.length ? (
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Item</th><th>Member</th><th>Paid with</th><th className="t-right">Amount</th><th>Status</th><th><span className="sr-only">Receipt</span></th></tr>
          </thead>
          <tbody>
            {shown.map(p => (
              <tr key={p.id}>
                <td className="num t-date">{fmtDay(p.date, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td>
                  <p className="row-title">{p.desc}</p>
                  <p className="row-sub">{p.cat} · {p.id}</p>
                </td>
                <td><Who who={p.who} /></td>
                <td className="t-method">{p.method}</td>
                <td className={`num t-right t-amount ${p.status === 'Paid' ? '' : 't-credit'}`}>{p.status === 'Paid' ? money(p.amount) : `+${money(p.amount)}`}</td>
                <td><Badge tone={p.status === 'Paid' ? 'green' : p.status === 'Credited' ? 'blue' : 'neutral'}>{p.status}</Badge></td>
                <td className="t-right"><button className="icon-btn" aria-label={`Download receipt ${p.id}`} onClick={() => toast(`Receipt ${p.id} downloaded`)}><Download size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Empty icon={Receipt} title="No purchases match">
          Try a wider date range or <button className="link-btn" onClick={reset}>clear all filters</button>.
        </Empty>
      )}
    </section>
  );
}
