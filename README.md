# 首爾五日韓國行程手帳

台中出發、2026/12/05 至 12/09 的韓國五天四夜互動行程地圖。頁面以時間軸推估旅途中每個時段的位置，並以 OpenStreetMap 顯示底圖；位置不是 GPS，也不能取代導航。

## 內容

- 水原 Starfield 星空圖書館 2.0、水原華城、愛寶樂園
- 南山塔與愛情鎖牆、廣藏市場、COEX Aquarium、COEX Mall
- 恩平韓屋村、益善洞、明洞、Mohegan INSPIRE
- TW670 台中 → 仁川、TW669 仁川 → 台中

`public/itinerary.js` 是單一行程來源；景點座標與停留時間是概略估算，航班時間依提供的行程 PDF。PDF 未提供飯店個人資料，本專案也不儲存 GPS、姓名、電話或地址。

## 本機執行

```sh
python -m http.server 8768 --bind 127.0.0.1 --directory public
```

測試：

```sh
node --test tests/itinerary.test.mjs
```

GitHub Actions 會在 `main` 更新後，把 `public/` 發布到 `gh-pages`。Leaflet 使用本地 vendored 版本，OpenStreetMap 瓦片由瀏覽器即時載入並保留 attribution；離線時仍可操作時間軸，但底圖可能無法顯示。
