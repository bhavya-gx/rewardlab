export type Tier = 1 | 2 | 3;
export type Recipient = { name: string; email: string; team: string; project: string; tier: Tier; admin: boolean };
export type Reward = { id: string; sponsor: string; kind: 'credits' | 'subscription' | 'merchandise'; amount: number; unit: string; mode: 'automatic' | 'approval'; description: string };
export type Claim = { status: 'pending' | 'confirmed' | 'failed'; destination: string; reference: string };
export type Config = { event: string; message: string; linkText: string; accent: string; deadline: string };
export type Campaign = { id: string; config: Config; recipients: Recipient[]; created: string };
export const initialConfig: Config = { event: 'The Builders Weekend', message: 'Your work stood out. Here is what comes next.', linkText: 'Open your reward', accent: '#1B52C4', deadline: '2026-12-31' };
export const sampleRecipients: Recipient[] = [
  { name: 'Alex Chen', email: 'alex@example.com', team: 'Team 01', project: 'Research copilot', tier: 1, admin: true },
  { name: 'Sam Rivera', email: 'sam@example.com', team: 'Team 01', project: 'Research copilot', tier: 1, admin: false },
  { name: 'Jordan Patel', email: 'jordan@example.com', team: 'Team 01', project: 'Research copilot', tier: 1, admin: false },
  { name: 'Casey Lee', email: 'casey@example.com', team: 'Team 02', project: 'Support agent', tier: 2, admin: true },
  { name: 'Taylor Kim', email: 'taylor@example.com', team: 'Team 02', project: 'Support agent', tier: 2, admin: false },
  { name: 'Morgan Reed', email: 'morgan@example.com', team: 'Team 03', project: 'Knowledge search', tier: 3, admin: true },
];
export function rewardsFor(tier: Tier): Reward[] {
  const i = tier - 1;
  return [
    { id: 'compute', sponsor: 'Compute sponsor', kind: 'credits', amount: [10000,5000,1000][i], unit: 'compute credits', mode: 'automatic', description: 'One shared grant for your team workspace.' },
    { id: 'tools', sponsor: 'Developer tools sponsor', kind: 'subscription', amount: [12,6,3][i], unit: 'months of access', mode: 'approval', description: 'One team subscription, subject to demo sponsor approval.' },
    { id: 'merch', sponsor: 'Event organiser', kind: 'merchandise', amount: 1, unit: 'team merchandise pack', mode: 'approval', description: 'One pack for your team. No real address is collected in this demo.' },
  ];
}
export function validateRecipients(rows: Recipient[]): string[] {
  const issues: string[] = [];
  if (!rows.length) issues.push('Add at least one recipient.');
  if (rows.length > 1000) issues.push('The prototype supports up to 1,000 recipients per batch.');
  const emails = new Set<string>();
  rows.forEach((r,i) => {
    if (!r.name.trim() || !r.team.trim() || !r.project.trim()) issues.push(`Row ${i+1}: name, team and project are required.`);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) issues.push(`Row ${i+1}: enter a valid email.`);
    const email = r.email.toLowerCase().trim();
    if (emails.has(email)) issues.push(`Row ${i+1}: duplicate email ${r.email}.`);
    emails.add(email);
    if (![1,2,3].includes(r.tier)) issues.push(`Row ${i+1}: award tier must be 1, 2 or 3.`);
  });
  for (const team of new Set(rows.map(r=>r.team))) {
    const members = rows.filter(r=>r.team===team);
    if (members.filter(r=>r.admin).length !== 1) issues.push(`${team}: choose exactly one team administrator.`);
    if (new Set(members.map(r=>r.tier)).size !== 1 || new Set(members.map(r=>r.project)).size !== 1) issues.push(`${team}: all members must have the same project and award tier.`);
  }
  return issues;
}
export function validateConfig(c: Config): string[] {
  const errors = [];
  if (!c.event.trim()) errors.push('Enter your event name.');
  if (!c.message.trim()) errors.push('Add your award message.');
  if (!c.linkText.trim()) errors.push('Add your invitation link text.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.deadline) || !Number.isFinite(Date.parse(c.deadline+'T23:59:59Z'))) errors.push('Choose a valid claim deadline.');
  else if (Date.parse(c.deadline+'T23:59:59Z') < Date.now()) errors.push('Choose a future claim deadline.');
  return errors;
}
// Quoted CSV fields, escaped quotes, BOM and Windows line endings supported.
export function parseRecipients(csv: string): Recipient[] {
  if (csv.length > 500000) throw new Error('Use a CSV smaller than 500 KB.');
  const records: string[][] = []; let row: string[] = [], field = '', quoted = false;
  const text = csv.replace(/^\uFEFF/, '');
  for (let i=0;i<text.length;i++) {
    const ch=text[i];
    if(ch==='"') { if(quoted && text[i+1]==='"') { field+='"';i++; } else quoted=!quoted; }
    else if(ch===',' && !quoted) { row.push(field.trim());field=''; }
    else if((ch==='\n'||ch==='\r')&&!quoted) { if(ch==='\r'&&text[i+1]==='\n')i++;row.push(field.trim()); if(row.some(Boolean))records.push(row);row=[];field=''; }
    else field+=ch;
  }
  if(quoted)throw new Error('A quoted CSV field is not closed.');
  row.push(field.trim()); if(row.some(Boolean))records.push(row);
  const header=records.shift()?.map(v=>v.toLowerCase());
  const columns=['name','email','team','project','tier','admin'];
  if(!header||columns.some(c=>!header.includes(c)))throw new Error('Use the template columns: name, email, team, project, tier, admin.');
  if(records.length>1000)throw new Error('Use no more than 1,000 rows.');
  return records.map((record,index)=>{
    const get=(key:string)=>record[header.indexOf(key)]||'';
    if(!['true','false'].includes(get('admin').toLowerCase()))throw new Error(`Row ${index+1}: admin must be true or false.`);
    return {name:get('name'),email:get('email'),team:get('team'),project:get('project'),tier:Number(get('tier')) as Tier,admin:get('admin').toLowerCase()==='true'};
  });
}
export function claimKey(campaign: string, team: string, reward: string) { return JSON.stringify([campaign,team,reward]); }
export function requestClaim(claims: Record<string,Claim>, key: string, destination: string, mode: Reward['mode'], isAdmin: boolean): Record<string,Claim> {
  if(!isAdmin || !destination.trim() || claims[key]?.status==='confirmed' || claims[key]?.status==='pending')return claims;
  return {...claims,[key]:{status:mode==='approval'?'pending':'confirmed',destination:destination.trim(),reference:claims[key]?.reference??`DEMO-${Object.keys(claims).length+1}`}};
}
export function csvCell(value: string) { const safe=/^[=+@\-\t\r]/.test(value)?"'"+value:value; return '"'+safe.replaceAll('"','""')+'"'; }
