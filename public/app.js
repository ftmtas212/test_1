import {places,dayMeta,stops,start,end,time,stateAt,dayOf,hhmm} from './itinerary.js';
const $=id=>document.getElementById(id);
let current=time(9,'16:15'),selectedDay=0,timer=null,lastTick=0;
const modes={flight:'飛行',rail:'高鐵',drive:'乘車',stay:'休息'};
const map=L.map('map',{zoomControl:false}).setView([26.9,99.6],7);
L.control.zoom({position:'topright'}).addTo(map);
L.control.scale({imperial:false,position:'bottomright'}).addTo(map);
// Offline embedded geographic context avoids tile-server 403 errors when this page is opened as file://.
const sy=lat=>52-lat;
const offlineSvg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="97.5 23 25 6" preserveAspectRatio="none">
 <rect width="25" height="6" x="97.5" y="23" fill="#dfe9e5"/>
 <path d="M97.5 22.8 103 22.5 110 22.3 118 22.8 122.5 24.2 121.8 27.6 116 29.4 108 30 103 30.8 99.3 29.8 97.5 28Z" fill="#b8cfc7" stroke="#718f86" stroke-width=".05"/>
 <path d="M97.5 23.3 99.2 23 101.5 23.2 103.5 23.8 104.4 25.8 103.8 27.8 104 29.6 101.6 30.2 99.3 29.5 98.3 27.5 98.8 25.8Z" fill="#8fb8a7" stroke="#4f806f" stroke-width=".045"/>
 <path d="M98.8 29.1C99.7 27.7 99.3 26.3 100.4 25.1M100.8 29.8C101.4 28.3 102.1 27.4 102.8 25.2M102.4 29.6C101.6 27.8 101.7 26.6 102.1 24.5M103.2 28.8C102.7 27.2 103.8 26.3 103.5 24.1" fill="none" stroke="#b9e0d2" stroke-width=".035"/>
 <path d="M121.1 26.7c.45-.45.8-.9 1.15-1.35l.18.08-.2.42-.35.28-.15.45-.3.22z" fill="#8fb8a7" stroke="#4f806f" stroke-width=".035"/>
 <g fill="#47665f" font-family="sans-serif" font-size=".18"><text x="102.2" y="26.1" fill="#295c50" font-size=".24">YUNNAN</text><text x="108.1" y="25.2">CHINA SW</text><text x="112.9" y="27.2">GUANGDONG</text><text x="120.2" y="26.0">TAIWAN</text></g>
 </svg>`;
const offlineMap=new DOMParser().parseFromString(offlineSvg,'image/svg+xml').documentElement;
const offlineOverlay=L.svgOverlay(offlineMap,[[23,97.5],[29,122.5]],{opacity:.92,interactive:false});
const tiles=L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
tiles.on('tileerror',()=>{$('tile-warning').hidden=false;offlineOverlay.addTo(map)});
tiles.on('tileload',()=>{if(map.hasLayer(offlineOverlay))map.removeLayer(offlineOverlay);$('tile-warning').hidden=true});
const route=L.layerGroup().addTo(map),points=L.layerGroup().addTo(map);
const person=L.marker([0,0],{title:'旅人・推估位置',alt:'旅人・推估位置',zIndexOffset:1000,icon:L.divIcon({className:'traveler',html:'<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="13" cy="5" r="2.5" fill="currentColor"/><path d="m10 10 3-2 3 5 3 1M12 9l-2 6-3 6m4-6 4 6M10 10l-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',iconSize:[38,38],iconAnchor:[19,19]})}).addTo(map);
const activeLine=L.polyline([],{color:'#c99345',weight:5,opacity:.9}).addTo(map);
const allLine=L.polyline(stops.map(s=>s.coord),{color:'#819d94',weight:2,dashArray:'4 8',opacity:.45});
for(let d=8;d<=17;d++){
 const b=document.createElement('button');b.className='day-tab';b.dataset.day=d;b.innerHTML=`<small>DAY ${String(d-7).padStart(2,'0')}</small><strong>10/${String(d).padStart(2,'0')}</strong><span>${dayMeta[d-8][2]==='返家'?'台北・返家':dayMeta[d-8][2]}</span>`;
 b.addEventListener('click',()=>{pause();setTime(d===8?start:d===17?time(d,'07:30'):time(d,'09:00'));fitDay()});$('days').append(b);
}
function fitDay(){map.fitBounds(L.latLngBounds(stops.filter(s=>s.day===selectedDay).map(s=>s.coord)),{padding:[45,65],maxZoom:11})}
function renderDay(d){
 selectedDay=d;const meta=dayMeta[d-8],daily=stops.filter(s=>s.day===d);
 document.querySelectorAll('.day-tab').forEach(b=>{const active=Number(b.dataset.day)===d;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});
 $('day-number').textContent=`DAY ${String(d-7).padStart(2,'0')}`;$('day-date').textContent=`2026 / 10 / ${String(d).padStart(2,'0')}`;
 $('day-title').textContent=meta[0];$('day-route').textContent=meta[1];$('hotel-city').textContent=meta[2];$('hotel').textContent=meta[3];$('day-note').textContent=meta[4];$('schedule').replaceChildren();
 route.clearLayers();points.clearLayers();
 L.polyline(daily.map(s=>s.coord),{color:'#2a6555',weight:3,dashArray:'7 8',opacity:.75}).addTo(route);
 daily.forEach((s,i)=>{
  const b=document.createElement('button');b.className='stop-row';b.dataset.id=s.id;b.innerHTML=`<span class="stop-dot"></span><span><strong>${s.label}</strong><small>${hhmm(s.arrival)}–${hhmm(s.departure)}${s.flight?' · '+s.flight:' · 推估'}</small></span>`;
  b.onclick=()=>{pause();setTime(s.arrival);map.setView(s.coord,Math.max(map.getZoom(),10))};$('schedule').append(b);
  L.marker(s.coord,{icon:L.divIcon({className:'map-stop',html:String(i+1),iconSize:[20,20],iconAnchor:[10,10]})}).bindTooltip(`${places[s.place][0]} · ${hhmm(s.arrival)}（位置概略）`).on('click',()=>{pause();setTime(s.arrival)}).addTo(points);
 });
}
function setTime(value,{autofit=true}={}){
 const n=Number(value);if(!Number.isFinite(n))return;
 current=Math.round(Math.max(start,Math.min(end,n))/60000)*60000;
 const s=stateAt(current),d=dayOf(current),changed=d!==selectedDay;
 if(changed)renderDay(d);
 $('timeline').value=current;$('timeline').setAttribute('aria-valuetext',`10月${d}日 ${hhmm(current)}`);
 $('clock').textContent=hhmm(current);$('clock-date').textContent=`10 月 ${d} 日 · 第 ${d-7} 天`;
 $('selected-time').value=new Date(current+8*3600000).toISOString().slice(0,16);
 $('position-label').textContent=s.kind==='travel'?'此時預計在途中':'此時預計在';
 $('position').textContent=s.kind==='travel'?`${places[s.stop.place][0]} → ${places[s.next.place][0]}`:places[s.stop.place][0];
 $('activity').textContent=s.kind==='travel'?`${modes[s.stop.mode]}${s.stop.flight?' '+s.stop.flight:''} · ${hhmm(s.stop.departure)} 出發 → ${hhmm(s.next.arrival)} 抵達 · 約 ${Math.round(s.progress*100)}%`:`${s.stop.label} · ${hhmm(s.stop.arrival)}–${hhmm(s.stop.departure)}`;
 $('certainty').textContent=s.kind==='travel'&&s.stop.mode==='flight'?'票面航班時間 · 航跡與位置推估':'時間與位置為推估 · 非 GPS';
 person.setLatLng(s.coord);person.bindTooltip(s.kind==='travel'?`${modes[s.stop.mode]}中・推估位置`:`${places[s.stop.place][0]}・推估位置`,{direction:'top',offset:[0,-22]});
 activeLine.setLatLngs(s.kind==='travel'?[s.stop.coord,s.coord]:[]);
 document.querySelectorAll('.stop-row').forEach(b=>{const active=Number(b.dataset.id)===s.stop.id;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'step':'false')});
 if(autofit&&$('follow').checked){if(changed)fitDay();if(!map.getBounds().pad(-.15).contains(s.coord))map.panTo(s.coord,{animate:false})}
}
function pause(){if(timer)clearInterval(timer);timer=null;$('play').textContent='▶';$('play').setAttribute('aria-label','播放旅程')}
$('timeline').min=start;$('timeline').max=end;
$('timeline').oninput=e=>{pause();$('notice').textContent='';setTime(e.target.value)};
$('play').onclick=()=>{if(timer)return pause();if(current>=end)setTime(start);lastTick=performance.now();$('play').textContent='Ⅱ';$('play').setAttribute('aria-label','暫停播放');let simulated=current;timer=setInterval(()=>{const now=performance.now();simulated+=(now-lastTick)*Number($('speed').value)*60;lastTick=now;setTime(simulated);if(current>=end)pause()},150)};
$('selected-time').onchange=e=>{const t=Date.parse(e.target.value+':00+08:00');pause();if(Number.isFinite(t)){setTime(t);$('notice').textContent=t<start||t>end?'已定位到行程範圍內最近的時間。':''}};
$('now').onclick=()=>{pause();const now=Date.now();setTime(now);$('notice').textContent=now<start?'旅程尚未開始，先看看出發安排。':now>end?'旅程已結束，現在顯示返家時刻。':'已跳到目前時間對應的預估行程。'};
$('fit-day').onclick=()=>{map.removeLayer(allLine);fitDay()};
$('fit-all').onclick=()=>{allLine.addTo(map);map.fitBounds(allLine.getBounds(),{padding:[40,60]});$('follow').checked=false};
$('follow').onchange=()=>{if($('follow').checked){map.removeLayer(allLine);map.panTo(person.getLatLng())}};
setTime(current);fitDay();
