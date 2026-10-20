import {places,dayMeta,dayDateLabel,stops,start,end,time,stateAt,dayOf,hhmm} from './itinerary.js';
const $=id=>document.getElementById(id);
let current=time(1,'15:00'),selectedDay=0,timer=null,lastTick=0;
const modes={flight:'飛行',rail:'高鐵',drive:'乘車',stay:'休息'};
const map=L.map('map',{zoomControl:false}).setView([37.5,127],8);
L.control.zoom({position:'topright'}).addTo(map);
L.control.scale({imperial:false,position:'bottomright'}).addTo(map);
// A small offline context is only shown when the OSM tile service fails.
const offlineSvg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="124 33 6 6" preserveAspectRatio="none">
 <rect width="6" height="6" x="124" y="33" fill="#f2eee7"/>
 <path d="M124.4 37.6 125 36.3 125.8 35.8 126.6 35.3 127.6 34.9 128.7 35 129.6 35.7 129.2 36.5 128.6 37.3 127.8 37.6 126.7 37.7 125.8 38.3 124.8 38.1Z" fill="#e8c7c5" stroke="#ae6c70" stroke-width=".035"/>
 <path d="M126.1 35.7 126.7 35.1 127.7 35 128.3 35.3 128 35.8 127.2 36.2 126.4 36.1Z" fill="#f6d9a0"/>
 <path d="M124.5 37.6 125.5 37.4 126.2 37.8 127.2 38.2 128.2 38.1 129.3 37.6" fill="none" stroke="#c9a6a5" stroke-width=".025"/>
 <g fill="#603e4e" font-family="sans-serif" font-size=".18"><text x="126.5" y="35.9" font-size=".26">SEOUL</text><text x="125.7" y="36.7">SUWON</text><text x="128.4" y="36.7">INCHEON</text><text x="124.2" y="39">KOREA</text></g>
 </svg>`;
const offlineMap=new DOMParser().parseFromString(offlineSvg,'image/svg+xml').documentElement;
const offlineOverlay=L.svgOverlay(offlineMap,[[33,124],[39,130]],{opacity:.92,interactive:false});
const tiles=L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
tiles.on('tileerror',()=>{$('tile-warning').hidden=false;offlineOverlay.addTo(map)});
tiles.on('tileload',()=>{if(map.hasLayer(offlineOverlay))map.removeLayer(offlineOverlay);$('tile-warning').hidden=true});
const route=L.layerGroup().addTo(map),points=L.layerGroup().addTo(map);
const person=L.marker([0,0],{title:'旅人・推估位置',alt:'旅人・推估位置',zIndexOffset:1000,icon:L.divIcon({className:'traveler',html:'<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="13" cy="5" r="2.5" fill="currentColor"/><path d="m10 10 3-2 3 5 3 1M12 9l-2 6-3 6m4-6 4 6M10 10l-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',iconSize:[38,38],iconAnchor:[19,19]})}).addTo(map);
const activeLine=L.polyline([],{color:'#df1e2f',weight:5,opacity:.9}).addTo(map);
const allLine=L.polyline(stops.map(s=>s.coord),{color:'#6b5b72',weight:2,dashArray:'4 8',opacity:.45});
for(let d=1;d<=5;d++){
 const b=document.createElement('button');b.className='day-tab';b.dataset.day=d;b.innerHTML=`<small>DAY ${String(d).padStart(2,'0')}</small><strong>${dayDateLabel(d)}</strong><span>${dayMeta[d-1][0]}</span>`;
 b.addEventListener('click',()=>{pause();setTime(d===1?start:d===5?time(5,'08:00'):time(d,'09:00'));fitDay()});$('days').append(b);
}
function fitDay(){map.fitBounds(L.latLngBounds(stops.filter(s=>s.day===selectedDay).map(s=>s.coord)),{padding:[45,65],maxZoom:12})}
function renderDay(d){
 selectedDay=d;const meta=dayMeta[d-1],daily=stops.filter(s=>s.day===d);
 document.querySelectorAll('.day-tab').forEach(b=>{const active=Number(b.dataset.day)===d;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});
 $('day-number').textContent=`DAY ${String(d).padStart(2,'0')}`;$('day-date').textContent=dayDateLabel(d);
 $('day-title').textContent=meta[0];$('day-route').textContent=meta[1];$('hotel-city').textContent=meta[2];$('hotel').textContent=meta[3];$('day-note').textContent=meta[4];$('schedule').replaceChildren();
 route.clearLayers();points.clearLayers();
 L.polyline(daily.map(s=>s.coord),{color:'#633f62',weight:3,dashArray:'7 8',opacity:.75}).addTo(route);
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
 $('timeline').value=current;$('timeline').setAttribute('aria-valuetext',`${dayDateLabel(d)} ${hhmm(current)}`);
 $('clock').textContent=hhmm(current);$('clock-date').textContent=`${dayDateLabel(d)} · 時間為推估`;
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
