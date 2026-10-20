// Korea five-day group itinerary. Coordinates are approximate points for the
// timeline map, not surveyed POIs or navigation coordinates.
export const places = {
 taichung:['台中國際機場 RMQ',24.2647,120.6206], incheon:['仁川國際機場 ICN',37.4602,126.4407],
 incheonHotel:['仁川住宿區域',37.4775,126.6324], starfield:['水原 Starfield 星空圖書館 2.0',37.2868,126.9935],
 suwon:['水原華城',37.2850,127.0140], everland:['愛寶樂園',37.2943,127.2025],
 nseoul:['N 首爾塔・愛情鎖牆',37.5512,126.9882], gwangjang:['廣藏市場',37.5701,126.9997],
 coex:['COEX 水族館',37.5133,127.0598], coexMall:['COEX Mall',37.5138,127.0589],
 eunpyeong:['恩平韓屋村',37.6418,126.9340], beauty:['韓流時尚彩妝店',37.5636,126.9855],
 ikseondong:['益善洞韓屋村',37.5746,126.9910], myeongdong:['首爾明洞商圈',37.5636,126.9851],
 inspire:['Mohegan INSPIRE 極光道',37.4473,126.4562]
};

export const dayMeta = [
 ['抵達仁川','台中 → 仁川 → 飯店','仁川','Diamond HOTEL 或同級','出發日已確認為 2026/12/05；團體航班 TW670。'],
 ['水原與愛寶樂園','仁川 → 水原 → 龍仁','仁川','Benikea The BLISS／SOPRA／AIR SKY 或同級','Starfield 星空圖書館、水原華城與愛寶樂園，午餐於樂園自理。'],
 ['首爾經典地標','南山 → 廣藏 → COEX','仁川','Benikea The BLISS／SOPRA／AIR SKY 或同級','南山塔不上塔，含南山纜車來回券；晚餐韓式烤肉吃到飽。'],
 ['韓屋、手作與明洞','恩平 → 益善洞 → 明洞','仁川','Benikea The BLISS／SOPRA／AIR SKY 或同級','水果大福 DIY 與韓屋街散策；晚餐方便逛街，敬請自理。'],
 ['帶著首爾回家','INSPIRE → 仁川 → 台中','返家','溫暖的家','回程航班 TW669：仁川 14:25 → 台中 16:30。']
];

export const time = (day,hm) => Date.parse(`2026-12-${String(day+4).padStart(2,'0')}T${hm}:00+08:00`);
export const dayDateLabel = day => `2026/12/${String(day+4).padStart(2,'0')}`;

const rows = [
 [1,'15:00','17:30','taichung','台中清泉崗機場集合','flight','TW670'],
 [1,'21:10','22:00','incheon','抵達仁川・入境取行李','drive'],
 [1,'22:30','23:59','incheonHotel','前往飯店・休息','stay'],
 [2,'00:00','07:30','incheonHotel','飯店早餐・集合出發','drive'],
 [2,'09:30','11:00','starfield','水原 Starfield 星空圖書館 2.0','drive'],
 [2,'11:30','13:00','suwon','UNESCO 水原華城','drive'],
 [2,'14:00','19:30','everland','愛寶樂園・自由券暢玩','drive'],
 [2,'21:00','23:59','incheonHotel','返回仁川住宿','stay'],
 [3,'00:00','08:00','incheonHotel','飯店早餐・前往首爾','drive'],
 [3,'09:30','11:00','nseoul','南山塔不上塔・愛情鎖牆','drive'],
 [3,'11:30','13:00','gwangjang','廣藏市場・午餐自理','drive'],
 [3,'14:00','16:00','coex','COEX Aquarium 水族館','drive'],
 [3,'16:00','19:30','coexMall','COEX Mall 地下購物中心','drive'],
 [3,'21:00','23:59','incheonHotel','返回仁川住宿','stay'],
 [4,'00:00','08:00','incheonHotel','飯店早餐・集合出發','drive'],
 [4,'09:30','11:00','eunpyeong','恩平韓屋村','drive'],
 [4,'12:00','14:00','beauty','韓流時尚彩妝店・文化體驗','drive'],
 [4,'14:30','16:00','ikseondong','益善洞韓屋村','drive'],
 [4,'16:30','20:30','myeongdong','明洞商圈逛街・晚餐自理','drive'],
 [4,'21:00','23:59','incheonHotel','返回仁川住宿','stay'],
 [5,'00:00','07:30','incheonHotel','飯店早餐・退房','drive'],
 [5,'08:30','10:30','inspire','Mohegan INSPIRE LED 極光道','drive'],
 [5,'11:00','14:25','incheon','仁川機場・辦理登機','drive'],
 [5,'14:25','16:30','taichung','回程航班 TW669・抵達台中','flight','TW669']
];

export const stops = rows.map(([day,a,b,place,label,mode,flight],i)=>({id:i,day,arrival:time(day,a),departure:time(day,b),place,label,mode,flight,coord:places[place].slice(1)}));
export const start = stops[0].arrival, end = stops.at(-1).departure;
export function stateAt(value){
 const t=Math.max(start,Math.min(end,Number(value)));
 for(let i=0;i<stops.length;i++){
  const a=stops[i], b=stops[i+1];
  if(t<=a.departure || !b) return {kind:'stop',stop:a,coord:a.coord,progress:0};
  if(t<b.arrival){
   const f=(t-a.departure)/(b.arrival-a.departure);
   if(a.place===b.place) return {kind:'stop',stop:a,coord:a.coord,progress:0};
   return {kind:'travel',stop:a,next:b,progress:f,coord:a.coord.map((v,j)=>v+(b.coord[j]-v)*f)};
  }
 }
}
export const dayOf = t => Math.min(5,Math.max(1,Number(new Date(Number(t)+8*3600000).toISOString().slice(8,10))-4));
export const hhmm = t => new Date(t+8*3600000).toISOString().slice(11,16);
