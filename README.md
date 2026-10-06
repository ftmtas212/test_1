# 雲南十日行程地圖

靜態 HTML/CSS/ES modules + vendored Leaflet 1.9.4。正式入口 http://192.168.68.48:8088/ ，owner 為 PVE .20 → Dashboard LXC100。無 GPS、後端、資料庫或機密設定。

`public/itinerary.js` 是單一行程來源。`places` 使用 WGS84 概略座標；`rows` 為日期、抵達時間、離開時間、地點、活動、下一段交通方式與航班。每段時間採 UTC+8。場景停留期間固定位置，交通期間對座標線性插值，路線虛線不代表導航。座標未逐一地理編碼驗證，尤其人馬吊橋、龍元村、哈滂瀑布、普卡旺與各觀景台只定位區域。票面航班時間取自使用者照片；其他時間為人工估算。

本機：`python -m http.server 8768 --bind 127.0.0.1 --directory apps/yunnan-journey/public`。

測試：`node --test apps/yunnan-journey/tests/itinerary.test.mjs`。維運、部署、回復與限制見 [runbook](../../docs/runbooks/yunnan-journey.md)。

Leaflet 來源：https://unpkg.com/leaflet@1.9.4/dist/leaflet.js 與同版 CSS；BSD-2-Clause 授權存 `public/vendor/LICENSE`。參考 [Leaflet 官方 quick start](https://leafletjs.com/examples/quick-start/)。OpenStreetMap 瓦片由瀏覽器即時載入，保留 attribution 與正常瀏覽器快取，不預抓／批量下載，遵守 [瓦片使用政策](https://operations.osmfoundation.org/policies/tiles/)。離線時行程仍可用，但底圖可能無法顯示。
