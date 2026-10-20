import {test} from 'node:test';
import assert from 'node:assert/strict';
import {stops,start,end,stateAt,time,dayOf} from '../public/itinerary.js';

test('five days, ordered stops and finite Korea/Taiwan anchors',()=>{
 assert.equal(new Set(stops.map(s=>s.day)).size,5);
 stops.forEach((s,i)=>{
  assert.ok(s.arrival<=s.departure);
  if(i)assert.ok(stops[i-1].departure<=s.arrival);
  assert.ok(s.coord.every(Number.isFinite));
  assert.ok(s.coord[0]>20&&s.coord[0]<40&&s.coord[1]>119&&s.coord[1]<131);
 });
});

test('PDF flight numbers and ticket times are preserved',()=>{
 const f=stops.filter(s=>s.flight);
 assert.deepEqual(f.map(s=>s.flight),['TW670','TW669']);
 assert.equal(f[0].departure,time(1,'17:30'));
 assert.equal(stops[f[0].id+1].arrival,time(1,'21:10'));
 assert.equal(stops[f[1].id-1].departure,time(5,'14:25'));
 assert.equal(f[1].departure,time(5,'16:30'));
});

test('dwell stays fixed; travel interpolates; exact arrival switches to stop',()=>{
 const a=stops[0],b=stops[1];
 assert.deepEqual(stateAt(time(1,'16:00')).coord,a.coord);
 const s=stateAt((a.departure+b.arrival)/2);
 assert.equal(s.kind,'travel');
 assert.equal(s.progress,.5);
 assert.deepEqual(s.coord,a.coord.map((v,i)=>(v+b.coord[i])/2));
 assert.equal(stateAt(b.arrival).stop,b);
});

test('clamping, overnight boundary and day count remain deterministic',()=>{
 assert.equal(stateAt(start-1e9).stop,stops[0]);
 assert.equal(stateAt(end+1e9).stop,stops.at(-1));
 assert.equal(stateAt(time(2,'00:00')).stop.day,2);
 assert.equal(stateAt(time(4,'23:59')+30000).kind,'stop');
 assert.equal(dayOf(time(5,'08:00')),5);
});
