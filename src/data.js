// Mock data. Everything here is fictional.
export const TODAY = new Date(2026, 8, 28, 14, 30);

export const people = {
  jordan: { name: 'Jordan Rivera', first: 'Jordan', color: '#4F739C' },
  sam: { name: 'Sam Rivera', first: 'Sam', color: '#7C6AA8' },
  maya: { name: 'Maya Rivera', first: 'Maya', color: '#D98A1C' },
  leo: { name: 'Leo Rivera', first: 'Leo', color: '#3E8E68' },
  chris: { name: 'Chris Okafor', first: 'Chris', color: '#B5654A' },
  family: { name: 'Rivera Family', first: 'Whole family', color: '#5A7FA8' },
};

export const me = {
  first: 'Jordan',
  last: 'Rivera',
  dob: '1988-04-12',
  gender: 'Female',
  email: 'jordan.rivera@example.com',
  phone: '(503) 555-0142',
  street: '214 SE Alder St',
  city: 'Portland',
  state: 'OR',
  zip: '97214',
  role: 'Primary',
  memberId: 'BND 2048 8817',
  since: 2021,
};

export const balance = { credit: 5, note: 'Applied automatically at your next checkout', latest: { label: 'Rain-out credit', date: '2026-09-17', amount: 5 } };

// stats: w/l/t record. rank/of: place in the league (null for clinics).
export const teams = [
  { id: 't1', name: 'Thunder U12 Girls', sport: 'Soccer', program: 'Fall 2026 Youth League', who: 'maya', stats: { w: 4, l: 1, t: 1 }, rank: 2, of: 8, unit: 'teams', coach: 'Dana Whitfield', active: true },
  { id: 't2', name: 'Mini Hoops', sport: 'Basketball', program: 'Fall Clinic · Ages 7–9', who: 'leo', stats: null, coach: 'Marcus Lee', active: true },
  { id: 't3', name: 'Late Swings', sport: 'Softball', program: 'Adult Coed · Wednesday Night', who: 'jordan', stats: { w: 3, l: 2 }, rank: 4, of: 10, unit: 'teams', coach: 'You', coachRole: 'Captain', active: true },
  { id: 't4', name: 'Thunder U11 Girls', sport: 'Soccer', program: 'Spring 2026 Youth League', who: 'maya', stats: { w: 7, l: 2, t: 1 }, rank: 1, of: 8, unit: 'teams', coach: 'Dana Whitfield', active: false, ended: '2026-05-30', champions: true },
  { id: 't5', name: 'Summer Pickleball Ladder', sport: 'Pickleball', program: 'Adult Intermediate', who: 'jordan', stats: { w: 9, l: 5 }, rank: 6, of: 24, unit: 'players', coach: 'Kate Morrison', coachRole: 'Coordinator', active: false, ended: '2026-08-15' },
  { id: 't6', name: 'Tiny Kickers', sport: 'Soccer', program: 'Spring 2025 · Ages 5–7', who: 'leo', stats: null, coach: 'Ana Suarez', active: false, ended: '2025-05-24' },
];

// League tables. Soccer uses points (3 per win, 1 per tie); softball and ladders use win %.
export const standings = {
  t1: [
    ['Rose City Stars', 5, 0, 1], ['Thunder U12 Girls', 4, 1, 1], ['Lake Oswego FC', 4, 2, 0], ['Westside Wolves', 3, 2, 1],
    ['Gresham United', 2, 3, 1], ['Eastside Rapids', 2, 4, 0], ['Tualatin Tigers', 1, 4, 1], ['Beaverton Blaze', 0, 5, 1],
  ],
  t3: [
    ['Can of Corn', 5, 0], ['Dirt Divas', 4, 1], ['Walk Offs', 4, 1], ['Late Swings', 3, 2], ['Bad News Bears', 3, 2],
    ['Foul Play', 2, 3], ['The Bunt Squad', 2, 3], ['Base Invaders', 1, 4], ['Swing Shift', 1, 4], ['Pitches Be Crazy', 0, 5],
  ],
  t4: [
    ['Thunder U11 Girls', 7, 2, 1], ['Rose City Stars', 7, 3, 0], ['Lake Oswego FC', 6, 3, 1], ['Hillsboro Hawks', 5, 4, 1],
    ['Westside Wolves', 4, 5, 1], ['Milwaukie Mariners', 3, 6, 1], ['Gresham United', 2, 7, 1], ['Tualatin Tigers', 1, 9, 0],
  ],
  t5: [
    ['Priya Shah', 13, 1], ['Tom Becker', 12, 2], ['Alicia Gomez', 11, 3], ['Dev Patel', 10, 4], ['Kate Morrison', 10, 4],
    ['Jordan Rivera', 9, 5], ['Luis Ortega', 8, 6], ['Mei Tanaka', 8, 6], ['Chris Hall', 7, 7], ['Sara Lindqvist', 7, 7],
  ],
};

const youth = (names, positions) => names.map((n, i) => ({ num: [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 14, 15, 17, 21][i], name: n, pos: positions[i] }));
export const rosters = {
  t1: {
    staff: [['Dana Whitfield', 'Head coach'], ['Rob Kim', 'Assistant coach'], ['Tina Alvarez', 'Team manager']],
    players: youth(
      ['Ava M.', 'Sofia K.', 'Emma L.', 'Chloe D.', 'Maya R.', 'Nora P.', 'Lily T.', 'Zoe B.', 'Isla W.', 'Grace H.', 'Aria S.', 'Ruby N.', 'Hana O.', 'Mila F.'],
      ['GK', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'MID', 'FWD', 'FWD', 'DEF', 'MID', 'FWD', 'GK']),
    family: 'Maya R.',
  },
  t2: {
    staff: [['Marcus Lee', 'Lead instructor'], ['Jess Park', 'Instructor']],
    players: ['Leo R.', 'Owen S.', 'Mateo G.', 'Eli K.', 'Noah B.', 'Kai T.', 'Liam D.', 'Ezra M.', 'Finn C.', 'Jonah W.', 'Theo A.', 'Ari P.', 'Sam L.', 'Max H.', 'Ben O.', 'Nico V.', 'Jude F.', 'Ivy R.'].map(name => ({ name })),
    family: 'Leo R.',
  },
  t3: {
    staff: [['Jordan Rivera', 'Captain']],
    players: [
      [12, 'Jordan Rivera', 'SS'], [2, 'Marcus Webb', 'P'], [5, 'Tasha Green', 'C'], [8, 'Ben Carter', '1B'], [11, 'Lina Park', '2B'],
      [14, 'Omar Haddad', '3B'], [17, 'Kelly Nguyen', 'LF'], [21, 'Drew Collins', 'CF'], [23, 'Nina Brooks', 'RF'],
      [27, 'Sam Rivera', 'EH'], [30, 'Paul Dunn', 'P'], [33, 'Erin Walsh', 'UT'], [44, 'Greg Lowe', 'UT'],
    ].map(([num, name, pos]) => ({ num, name, pos })),
    family: 'Jordan Rivera',
  },
  t4: {
    staff: [['Dana Whitfield', 'Head coach'], ['Rob Kim', 'Assistant coach']],
    players: youth(
      ['Ava M.', 'Sofia K.', 'Emma L.', 'Chloe D.', 'Maya R.', 'Nora P.', 'Lily T.', 'Zoe B.', 'Isla W.', 'Grace H.', 'Aria S.', 'Ruby N.', 'Hana O.'],
      ['GK', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'MID', 'FWD', 'FWD', 'DEF', 'MID', 'FWD']),
    family: 'Maya R.',
  },
  t5: { staff: [['Kate Morrison', 'Ladder coordinator']], players: [], family: 'Jordan Rivera' },
  t6: {
    staff: [['Ana Suarez', 'Coach']],
    players: ['Leo R.', 'Owen S.', 'Mia G.', 'Eli K.', 'Luna B.', 'Kai T.', 'Liam D.', 'Rosa M.', 'Finn C.', 'Jonah W.', 'Theo A.', 'Ari P.'].map(name => ({ name })),
    family: 'Leo R.',
  },
};
rosters.t5.players = standings.t5.map(([name]) => ({ name })).concat(['Ben Ito', 'Carla Diaz', 'Hugo Klein', 'Jess Fox', 'Mark Olsen', 'Nadia Ali', 'Omar Said', 'Quinn Reyes', 'Rita Moss', 'Theo Grant', 'Uma Rao', 'Vic Stone', 'Will Chen', 'Yara Haddad'].map(name => ({ name })));

export const reservations = [
  { id: 'r1', title: 'Pickleball Court 4', kind: 'Court', who: 'jordan', date: '2026-10-01', start: '18:00', end: '19:30', where: 'Indoor Courts', price: 24, status: 'Confirmed' },
  { id: 'r2', title: 'Batting Cage 2', kind: 'Cage', who: 'maya', date: '2026-10-03', start: '13:00', end: '13:30', where: 'Training Center', price: 0, status: 'Confirmed', note: 'Uses Batting Cage 10-pack' },
  { id: 'r3', title: "Party Room A · Leo's 9th birthday", kind: 'Room', who: 'leo', date: '2026-10-18', start: '14:00', end: '16:00', where: 'Main Building', price: 180, status: 'Deposit paid', note: '$120 due by Oct 11', due: true },
  { id: 'r4', title: 'Pickleball Court 2', kind: 'Court', who: 'jordan', date: '2026-09-17', start: '18:00', end: '19:30', where: 'Indoor Courts', price: 24, status: 'Completed' },
  { id: 'r5', title: 'Turf Field half · team practice', kind: 'Field', who: 'jordan', date: '2026-09-09', start: '20:00', end: '21:00', where: 'Dome', price: 95, status: 'Completed' },
  { id: 'r6', title: 'Batting Cage 1', kind: 'Cage', who: 'maya', date: '2026-08-29', start: '10:00', end: '10:30', where: 'Training Center', price: 0, status: 'Cancelled' },
];

export const passes = [
  { id: 'p1', kind: 'gym', name: 'Open Gym Punch Pass', who: 'jordan', type: 'punch', used: 5, total: 20, expires: '2027-03-31', active: true },
  { id: 'p2', kind: 'pool', name: 'Family Pool Membership', who: 'family', type: 'membership', price: 89, renews: '2026-10-15', active: true },
  { id: 'p3', kind: 'cage', name: 'Batting Cage 10-Pack', who: 'maya', type: 'punch', used: 7, total: 10, expires: '2026-12-31', active: true },
  { id: 'p4', kind: 'camp', name: 'Summer Camp Flex Pass', who: 'leo', type: 'season', expires: '2026-08-22', active: false, reason: 'Expired' },
  { id: 'p5', kind: 'court', name: 'Pickleball Drop-in 10-Pack', who: 'jordan', type: 'punch', used: 10, total: 10, expires: '2026-12-31', active: false, reason: 'All visits used' },
];

export const accounts = [
  {
    id: 'fam', type: 'Family', name: 'Rivera Family',
    members: [
      { id: 'jordan', name: 'Jordan Rivera', role: 'Primary', email: 'jordan.rivera@example.com', dob: '1988-04-12', color: people.jordan.color },
      { id: 'sam', name: 'Sam Rivera', role: 'Primary', email: 'sam.rivera@example.com', dob: '1986-11-03', color: people.sam.color },
      { id: 'maya', name: 'Maya Rivera', role: 'Dependent', email: '', dob: '2014-06-19', color: people.maya.color },
      { id: 'leo', name: 'Leo Rivera', role: 'Dependent', email: '', dob: '2017-10-18', color: people.leo.color },
    ],
  },
];

export const paymentMethods = [
  { id: 'pm1', kind: 'card', label: 'Visa', last4: '4242', detail: 'Expires 08/28', isDefault: true },
  { id: 'pm2', kind: 'bank', label: 'Chase Checking', last4: '6789', detail: 'Bank account via Link' },
  { id: 'pm3', kind: 'paypal', label: 'PayPal', last4: null, detail: 'jordan.rivera@example.com' },
];

export const purchases = [
  { id: 'R-10482', date: '2026-09-17', desc: 'Rain-out credit · Late Swings vs Walk Offs', who: 'jordan', cat: 'Credit', method: 'Account credit', amount: 5, status: 'Credited' },
  { id: 'R-10471', date: '2026-09-17', desc: 'Pickleball Court 2 · 90 min', who: 'jordan', cat: 'Reservation', method: 'Visa •••• 4242', amount: 24, status: 'Paid' },
  { id: 'R-10455', date: '2026-09-15', desc: 'Family Pool Membership · September', who: 'family', cat: 'Membership', method: 'Chase •••• 6789', amount: 89, status: 'Paid' },
  { id: 'R-10447', date: '2026-09-09', desc: 'Turf Field half · 60 min', who: 'jordan', cat: 'Reservation', method: 'Visa •••• 4242', amount: 95, status: 'Paid' },
  { id: 'R-10430', date: '2026-09-02', desc: 'Batting Cage 10-Pack', who: 'maya', cat: 'Pass', method: 'Visa •••• 4242', amount: 120, status: 'Paid' },
  { id: 'R-10412', date: '2026-08-28', desc: 'Mini Hoops Fall Clinic', who: 'leo', cat: 'Registration', method: 'PayPal', amount: 145, status: 'Paid' },
  { id: 'R-10398', date: '2026-08-20', desc: 'Thunder U12 Girls · Fall 2026', who: 'maya', cat: 'Registration', method: 'Visa •••• 4242', amount: 285, status: 'Paid' },
  { id: 'R-10390', date: '2026-08-18', desc: 'Adult Coed Softball · Fall player fee', who: 'jordan', cat: 'Registration', method: 'Chase •••• 6789', amount: 65, status: 'Paid' },
  { id: 'R-10366', date: '2026-08-15', desc: 'Family Pool Membership · August', who: 'family', cat: 'Membership', method: 'Chase •••• 6789', amount: 89, status: 'Paid' },
  { id: 'R-10341', date: '2026-08-09', desc: 'Party Room A deposit · Oct 18', who: 'leo', cat: 'Reservation', method: 'Visa •••• 4242', amount: 60, status: 'Paid' },
  { id: 'R-10310', date: '2026-07-22', desc: 'Summer Camp Flex Pass · week 5', who: 'leo', cat: 'Pass', method: 'Visa •••• 4242', amount: 75, status: 'Refunded' },
  { id: 'R-10288', date: '2026-07-15', desc: 'Family Pool Membership · July', who: 'family', cat: 'Membership', method: 'Chase •••• 6789', amount: 89, status: 'Paid' },
  { id: 'R-10205', date: '2026-06-10', desc: 'Summer Camp Flex Pass', who: 'leo', cat: 'Pass', method: 'Visa •••• 4242', amount: 300, status: 'Paid' },
  { id: 'R-10190', date: '2026-06-01', desc: 'Open Gym Punch Pass · 20 visits', who: 'jordan', cat: 'Pass', method: 'PayPal', amount: 160, status: 'Paid' },
  { id: 'R-10102', date: '2026-05-03', desc: 'Pickleball Drop-in 10-Pack', who: 'jordan', cat: 'Pass', method: 'Visa •••• 4242', amount: 90, status: 'Paid' },
];

// Recurring team events for Sep–Oct 2026, plus reservations, as one calendar feed.
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const soccerOpponents = ['Westside Wolves', 'Lake Oswego FC', 'Eastside Rapids', 'Tualatin Tigers', 'Gresham United', 'Rose City Stars', 'Beaverton Blaze', 'Hillsboro Hawks', 'Milwaukie Mariners'];
const softballOpponents = ['Dirt Divas', 'Bad News Bears', 'Pitches Be Crazy', 'Can of Corn', 'The Bunt Squad', 'Walk Offs', 'Base Invaders', 'Foul Play', 'Swing Shift'];

export const events = [];
let g = 0, s = 0;
for (let d = new Date(2026, 8, 1); d <= new Date(2026, 9, 31); d.setDate(d.getDate() + 1)) {
  const day = iso(d), w = d.getDay();
  if (w === 2 || w === 4) events.push({ date: day, start: '17:00', end: '18:30', title: 'Thunder U12 practice', team: 't1', who: 'maya', type: 'Practice', where: 'Delta Park · Field 3', note: w === 4 ? 'Bring shin guards and a full water bottle.' : null });
  if (w === 3) {
    events.push({ date: day, start: '17:30', end: '18:30', title: 'Mini Hoops clinic', team: 't2', who: 'leo', type: 'Class', where: 'Main Gym · Court B' });
    events.push({ date: day, start: '19:15', end: '20:30', title: `Late Swings vs ${softballOpponents[s++ % softballOpponents.length]}`, team: 't3', who: 'jordan', type: 'Game', where: 'Diamond 2', home: s % 2 === 1, arrive: 15 });
  }
  if (w === 6) {
    const home = g % 2 === 0;
    events.push({ date: day, start: '09:00', end: '10:30', title: `Thunder vs ${soccerOpponents[g++ % soccerOpponents.length]}`, team: 't1', who: 'maya', type: 'Game', where: 'Delta Park · Field 3', home, arrive: 30, note: home ? 'Wear blue home kit.' : 'Wear white away kit.' });
  }
}
for (const r of reservations) if (r.status !== 'Cancelled') events.push({ date: r.date, start: r.start, end: r.end, title: r.title, who: r.who, type: 'Reservation', where: r.where, res: r });
events.sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
