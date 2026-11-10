import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source=await readFile(new URL('../app/rewards/model.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const m=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
test('sample teams have one administrator each and consistent tiers',()=>{assert.deepEqual(m.validateRecipients(m.sampleRecipients),[]);assert.equal(new Set(m.sampleRecipients.map(r=>r.team)).size,3);});
test('CSV supports quotes, BOM, windows lines and rejects invalid format',()=>{
  const rows=m.parseRecipients('\uFEFFname,email,team,project,tier,admin\r\n"Chen, Alex",alex@example.com,A,"Project ""One""",1,true');
  assert.equal(rows[0].name,'Chen, Alex');assert.equal(rows[0].project,'Project "One"');assert.deepEqual(m.validateRecipients(rows),[]);
  assert.throws(()=>m.parseRecipients('name,email\na,b'));
  assert.throws(()=>m.parseRecipients('name,email,team,project,tier,admin\nA,a@b.com,T,P,1,yes'));
  assert.throws(()=>m.parseRecipients('"unclosed'));
});
test('duplicate identity, absent admin, inconsistent team and invalid tier block review',()=>{
  assert.ok(m.validateRecipients([...m.sampleRecipients,m.sampleRecipients[0]]).some(s=>s.includes('duplicate')));
  assert.ok(m.validateRecipients(m.sampleRecipients.map(r=>({...r,admin:false}))).some(s=>s.includes('administrator')));
  assert.ok(m.validateRecipients(m.sampleRecipients.map((r,i)=>i===1?{...r,tier:2}:r)).some(s=>s.includes('same project')));
  assert.ok(m.validateRecipients([{...m.sampleRecipients[0],tier:9}]).some(s=>s.includes('tier must')));
});
test('claims are shared, repeated claims do not duplicate, members cannot claim',()=>{
  const key=m.claimKey('batch','team','compute');
  const state=m.requestClaim({},key,'Workspace','automatic',true);
  assert.equal(state[key].status,'confirmed');assert.equal(m.requestClaim(state,key,'Another','automatic',true),state);
  assert.deepEqual(m.requestClaim({},key,'Workspace','automatic',false),{});
  assert.deepEqual(m.requestClaim({},key,'  ','automatic',true),{});
});
test('approval requests remain pending and failed requests can retry',()=>{
  const key=m.claimKey('batch','team','tools');
  const state=m.requestClaim({},key,'Workspace','approval',true);
  assert.equal(state[key].status,'pending');assert.equal(m.requestClaim(state,key,'Other','approval',true),state);
  assert.equal(m.requestClaim({[key]:{...state[key],status:'failed'}},key,'Workspace','approval',true)[key].status,'pending');
  assert.equal(m.requestClaim({[key]:{...state[key],status:'failed'}},key,'Workspace','approval',true)[key].reference,state[key].reference);
});
test('tiers stay separate and export escapes formulas and quotes',()=>{
  assert.equal(m.rewardsFor(1)[0].amount,10000);assert.equal(m.rewardsFor(3)[0].amount,1000);
  assert.equal(m.csvCell('=1+1'),'"\'=1+1"');assert.equal(m.csvCell('A"B'),'"A""B"');
  assert.notEqual(m.claimKey('a','b,c','d'),m.claimKey('a','b','c,d'));
});
test('configuration blocks expired dates and missing copy',()=>{
  assert.ok(m.validateConfig({...m.initialConfig,event:'',deadline:'2020-01-01'}).length>=2);
  assert.deepEqual(m.validateConfig({...m.initialConfig,deadline:'2099-01-01'}),[]);
});
