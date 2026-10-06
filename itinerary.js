// WGS84 approximate area anchors, not surveyed POIs or navigation coordinates.
export const places = {
 tpe:['桃園機場 TPE',25.0797,121.2342], can:['廣州白雲機場 CAN',23.3924,113.2988], kmg:['昆明長水機場 KMG',25.1019,102.9292],
 kunming:['昆明市區',25.04,102.71], dounan:['斗南花市',24.91,102.79], knstation:['昆明站',25.018,102.722], dalistation:['大理站',25.589,100.249], dali:['大理古城',25.697,100.164],
 panxi:['磻溪 S 灣・洱海生態廊道',25.78,100.16], xizhou:['喜洲古鎮',25.85,100.13], santorini:['理想邦・聖托里尼',25.71,100.28], wenbi:['文筆村',25.77,100.27], xiaoputuo:['小普陀',25.85,100.24], shuanglang:['雙廊古鎮',25.94,100.19],
 zhiziluo:['知子羅・記憶之城',26.55,98.91], laomudeng:['老姆登・皇冠峰',26.56,98.90], fugong:['福貢',26.90,98.87], bridge:['怒江人馬吊橋（福貢一帶）',26.94,98.86], shiyueliang:['石月亮觀景台一帶',27.11,98.86], bingzhongluo:['丙中洛觀景台一帶',28.00,98.62], gongshan:['貢山（途經）',27.74,98.67], dulong:['獨龍江鄉・住宿區域',27.88,98.34],
 longyuan:['龍元村（獨龍江一帶）',27.85,98.33], waterfall:['哈滂瀑布一帶',27.77,98.33], pukawang:['普卡旺一帶',27.92,98.33], nujiangbend:['怒江第一灣',27.97,98.62], liuku:['六庫',25.85,98.86], lijiang:['麗江古城',26.87,100.23], baisha:['白沙古鎮',26.95,100.22], wenchang:['文昌宮・麗江夜景',26.88,100.23],
 yangtzebend:['長江第一灣・石鼓',26.88,99.96], tiger:['上虎跳峽',27.18,100.11], shangrila:['香格里拉',27.83,99.70], feilaisi:['飛來寺・梅里雪山觀景',28.44,98.87], jinshabend:['金沙江大拐彎',28.29,99.30], baima:['白馬雪山觀景台一帶',28.35,99.08], pudacuo:['普達措國家公園',27.83,99.96], shstation:['香格里拉站',27.81,99.68]
};
export const dayMeta = [
 ['飛向雲南','台北 → 廣州 → 昆明','昆明','官渡浩楓溫德姆、恒盛（或同級）','依機票 21:30 抵達昆明；原表「全天自由活動」不適用，改以晚間接機入住推估。'],
 ['花市與洱海','昆明 → 大理','大理','理途、古曼（或同級）','高鐵班次尚未提供；先安排上午花市與中午高鐵。'],
 ['繞著洱海走','理想邦 → 雙廊','大理','理途、古曼（或同級）','沿原行程順序估算停留時間。'],
 ['走進怒江山谷','大理 → 知子羅 → 福貢','福貢','福源、國香（或同級）','山區路況與休息時間可能使抵達時間延後。'],
 ['越過山，抵達秘境','福貢 → 丙中洛 → 獨龍江','獨龍江','獨龍江天境酒店','吊橋未提供正式名稱，以福貢區域表示；進出獨龍江時間須由旅行社確認。'],
 ['獨龍江的村落','龍元 → 普卡旺 → 六庫','六庫','東方文豪、雲之尚（或同級）','景點分散且返程很長，晚抵六庫僅為示意；村落與瀑布位置待旅行社確認。'],
 ['古城慢時光','六庫 → 白沙 → 麗江','麗江','花筑木府、達安曼（或同級）','文昌宮安排於傍晚，住宿點以麗江古城區域表示。'],
 ['沿江向雪山','麗江 → 虎跳峽 → 飛來寺','飛來寺','居舍拾叁、梅里山尊（或同級）','長途山路日；香格里拉僅短暫休整。'],
 ['日照金山，再回昆明','梅里 → 普達措 → 昆明','昆明','官渡浩楓溫德姆、恒盛（或同級）','此日非常緊湊：白馬雪山／金沙江大拐彎依原表順序示意，實際順路安排與返昆高鐵班次須確認；日照金山不保證可見。'],
 ['帶著風景回家','昆明 → 廣州 → 台北','返家','無','依 07:30 航班，清晨退房與前往機場時間採估算。']
];
// Each stop owns an arrival and departure; travel fills the interval between stops.
const rows = [
 [8,'12:30','14:50','tpe','機場報到','flight','CZ3098'],[8,'17:15','19:10','can','廣州轉機','flight','CZ3489'],[8,'21:30','22:15','kmg','抵達昆明・接機','drive'],[8,'23:00','23:59','kunming','入住休息','stay'],
 [9,'00:00','08:00','kunming','住宿與早餐','drive'],[9,'08:40','09:40','dounan','斗南花市打卡','drive'],[9,'10:30','11:15','knstation','候車・高鐵班次待定','rail'],[9,'13:30','14:00','dalistation','抵達大理','drive'],[9,'14:40','15:30','dali','入住休整','drive'],[9,'16:00','16:45','panxi','洱海生態廊道 S 灣','drive'],[9,'17:15','18:15','xizhou','喜洲古鎮','drive'],[9,'19:00','23:59','dali','大理古城夜遊・住宿','stay'],
 [10,'00:00','08:30','dali','住宿與早餐','drive'],[10,'09:30','11:00','santorini','理想邦聖托里尼','drive'],[10,'11:30','13:00','wenbi','文筆村・午餐','drive'],[10,'13:40','14:30','xiaoputuo','小普陀・秋日洱海','drive'],[10,'15:15','17:00','shuanglang','雙廊古鎮','drive'],[10,'18:30','23:59','dali','返回大理住宿','stay'],
 [11,'00:00','07:30','dali','早餐後出發','drive'],[11,'13:30','14:30','zhiziluo','知子羅記憶之城','drive'],[11,'14:45','16:00','laomudeng','老姆登・皇冠峰觀景','drive'],[11,'18:00','23:59','fugong','抵達福貢・住宿','stay'],
 [12,'00:00','08:00','fugong','早餐後出發','drive'],[12,'08:30','09:00','bridge','怒江人馬吊橋','drive'],[12,'10:00','10:45','shiyueliang','石月亮觀景台','drive'],[12,'13:00','14:00','bingzhongluo','丙中洛觀景・午餐','drive'],[12,'15:00','15:10','gongshan','途經貢山・前往獨龍江','drive'],[12,'18:30','23:59','dulong','獨龍江入住','stay'],
 [13,'00:00','07:30','dulong','早餐後出發','drive'],[13,'08:00','08:40','longyuan','龍元村・獨龍族村寨','drive'],[13,'09:20','10:00','waterfall','哈滂瀑布','drive'],[13,'11:00','11:45','pukawang','普卡旺特色村','drive'],[13,'15:15','15:25','gongshan','返程途經貢山','drive'],[13,'16:15','16:45','nujiangbend','怒江第一灣觀景','drive'],[13,'22:30','23:59','liuku','晚抵六庫・住宿','stay'],
 [14,'00:00','08:00','liuku','六庫出發','drive'],[14,'13:30','14:30','lijiang','酒店入住・休整','drive'],[14,'15:00','16:30','baisha','白沙古鎮','drive'],[14,'17:15','19:00','wenchang','文昌宮・古城夜景','drive'],[14,'19:15','23:59','lijiang','麗江住宿','stay'],
 [15,'00:00','07:30','lijiang','早餐後出發','drive'],[15,'09:00','09:40','yangtzebend','長江第一灣','drive'],[15,'11:00','12:30','tiger','上虎跳峽','drive'],[15,'14:00','14:45','shangrila','香格里拉短暫休整','drive'],[15,'19:00','23:59','feilaisi','飛來寺入住','stay'],
 [16,'00:00','08:00','feilaisi','梅里雪山・日照金山（清晨）','drive'],[16,'09:30','10:00','jinshabend','金沙江大拐彎','drive'],[16,'11:00','11:30','baima','白馬雪山觀景台','drive'],[16,'14:00','16:00','pudacuo','普達措國家森林公園','drive'],[16,'17:00','18:00','shstation','候車・高鐵班次待定','rail'],[16,'23:00','23:15','knstation','返抵昆明（暫估）','drive'],[16,'23:45','23:59','kunming','昆明住宿','stay'],
 [17,'00:00','04:30','kunming','清晨退房','drive'],[17,'05:30','07:30','kmg','機場報到','flight','CZ3420'],[17,'09:50','11:20','can','廣州轉機','flight','CZ3097'],[17,'13:30','14:00','tpe','抵達台北・旅程結束','stay']
];
export const time = (day,hm) => Date.parse(`2026-10-${String(day).padStart(2,'0')}T${hm}:00+08:00`);
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
export const dayOf = t => Number(new Date(t+8*3600000).toISOString().slice(8,10));
export const hhmm = t => new Date(t+8*3600000).toISOString().slice(11,16);
