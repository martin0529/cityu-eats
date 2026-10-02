# 城大搵食指南 CityU Eats

香港城市大學三個飯堂（AC1 城大食坊／AC2 Canteen／AC3 Bistro）嘅菜單、評分同「必食／普通／避雷」評價一站式網站。學生自製，非官方。

學校目前只有 AC1 有官方網上菜單，AC2、AC3 一直冇得網上睇——呢個站就係想補返呢個位，順便俾大家分享邊樣好食、邊樣要避雷。

## 開始使用

```bash
cd cityu-eats/app
python -m http.server 8422
# 開啟 http://127.0.0.1:8422
```

純靜態網站，毋須安裝任何依賴，任何靜態伺服器（或 GitHub Pages／Netlify／Vercel）都跑到。

## 功能

| 功能 | 說明 |
|---|---|
| 菜單瀏覽 | 三個飯堂全部菜品，相片、價錢、星級一覽 |
| 分類篩選 | 按 中式飯類／粉麵／日韓／東南亞／西式／小食／飲品甜品 篩選，可按評論數／評分／價錢排序 |
| 評論系統 | 每道菜 1–5 星＋「必食／普通／避雷」印章評價＋暱稱（可匿名）＋評語 |
| 避雷排行榜 | 首頁即時統計最多人勸退嘅菜品 |
| 今日食咩 | 隨機幫你揀今日食乜，可以限定某個飯堂 |
| 中英雙語 | 右上角 一鍵切換，偏好會記住 |

## 資料同評論儲存

- **菜單資料**全部在 [`app/js/menu-data.js`](app/js/menu-data.js) 一個檔案：
  - AC1 的菜品與價錢於 **2026-10-02** 從官方點餐站（[csd.order.place](https://csd.order.place/home/store/112870)）抄錄，屬實但會過時；
  - **AC2／AC3 官方沒有網上菜單**，現有項目是代表性內容＋約數價錢，請按現場實況修改；
  - 想加菜／改價／換相片，直接編輯該檔案即可，格式有註解說明。
- **相片**目前是 Pexels 免費圖庫的佔位圖（`app/assets/`），歡迎換成真實實拍——覆蓋同名檔案或改 `menu-data.js` 的 `photo` 欄位。
- **範例評論**：站內標示「範例」的種子評論是我寫的示範內容，頁尾一鍵隱藏；正式使用時建議隱藏或刪掉，讓評論由真同學寫。

### 評論存哪裡？

| 模式 | 說明 |
|---|---|
| **Supabase 雲端（已啟用 ✅）** | 已連接專案「Cityu canteen comment website」——評論即時全校共享。金鑰在 `app/js/config.js`（anon/publishable key 為公開金鑰，安全性由 RLS 政策保障） |
| **localStorage（後備）** | 把 `config.js` 的 `SUPABASE_URL` / `SUPABASE_ANON_KEY` 清空即回到每個瀏覽器各自儲存模式 |

如要改用你自己的 Supabase 專案：到 [supabase.com](https://supabase.com) 開專案 → SQL Editor 執行 [`supabase-setup.sql`](supabase-setup.sql)（**記得一併執行檔末的 GRANT 語句**，否則匿名角色冇權讀寫）→ 把 Project URL 和 publishable/anon key 填入 `app/js/config.js`。

## 更新菜單的建議流程

1. 開學初去每個飯堂影低檔口菜牌（或官方點餐站）；
2. 逐項更新 `menu-data.js` 的 `dishes`；
3. `price` 用數字（如 `28.6`）、`cat` 用現有分類 id、`photo` 可省略（自動用分類色圖塊）；
4. 改完重新整理即可，毋須 build。

## 技術

- 純 HTML／CSS／JS，無框架無 build step
- 設計 tokens 在 [`app/css/style.css`](app/css/style.css) 頂部（溫暖食誌風：奶油紙底 × 豉油墨 × 叉燒紅 × 蛋黃 × 瓷磚綠）
- 字體：Noto Serif TC（標題）· Noto Sans TC（內文）· Bricolage Grotesque（英文數字），Google Fonts 載入
- 評論儲存層介面在 [`app/js/reviews.js`](app/js/reviews.js)（LocalStore／SupabaseStore 同一介面，可再擴充其他後端）

## 免責聲明

學生自製網站，非官方。菜單與價錢以飯堂現場為準。與 CityU 無從屬關係。
