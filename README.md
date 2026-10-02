# 城大搵食指南 CityU Eats

香港城市大學三個飯堂（AC1 城大食坊／AC2 Canteen／AC3 Bistro）嘅菜單、評分同「必食／普通／避雷」評價一站式網站。學生自製，非官方。

學校目前只有 AC1 有官方網上菜單，AC2、AC3 一直冇得網上睇——呢個站就係想補返呢個位，順便俾大家分享邊樣好食、邊樣要避雷。

## 版本

| 版本 | 日期 | 內容 |
|---|---|---|
| **0.2.0** | 2026-10-02 | 菜單雲端化（Supabase `canteens`／`dishes` 表＋`dish-images` 圖片桶，dashboard 改菜單即生效）、標籤 chips、三層後備載入（雲端→快取→內建）、評論正式接通 Supabase |
| 0.1.0 | 2026-10-02 | 首個公開版：三飯堂菜單瀏覽、分類篩選排序、星級＋必食/避雷評論系統、避雷排行榜、「今日食咩」隨機器、中英雙語 |

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

### 菜單：存在 Supabase（改完即生效，毋須重新部署 ✅）

菜單（飯堂／菜品／價錢／圖片／標籤）現存放於 Supabase 的 `canteens` 和 `dishes` 表：

| 想做什麼 | 去邊度做 |
|---|---|
| 改價錢／菜名／描述 | dashboard → **Table Editor** → `dishes` → 直接撳入格子改 |
| 加新菜 | Table Editor → `dishes` → Insert row（`id` 用英文 slug 如 `ac2-new-dish`，`category` 填 `rice/noodle/japanese/asian/western/snack/drinks` 其中一個） |
| 下架菜品（售罄） | 該行的 `available` 改成 `false`——網站自動隱藏 |
| 換菜品相片 | dashboard → **Storage** → `dish-images` bucket 上傳圖片 → 複製圖片公開 URL → 貼到該菜品的 `photo` 欄 |
| 改飯堂資料（開放時間等） | Table Editor → `canteens` |

改完**重新整理網站即見**。標籤 `tags` 欄支援：`signature`（招牌）、`spicy`（辣）、`value`（抵食）、`sweet`（甜）或任何自訂文字（逗號分隔）。

- `app/js/menu-data.js` 現在只是**後備資料**：雲端讀不到時（斷網／Supabase 停機）網站先用本地快取，再退回內建菜單，永不白屏
- 菜單資料表的完整 SQL 在根目錄 [`supabase-menu.sql`](supabase-menu.sql)（含種子資料，可重複執行）
- **相片**：現有種子圖片是 Pexels 免費圖庫的佔位圖，歡迎換成真實實拍（經 Storage 上傳）
- **範例評論**：站內標示「範例」的種子評論是示範內容，頁尾一鍵隱藏；正式使用時建議隱藏，讓評論由真同學寫

### 評論：存在 Supabase（已啟用 ✅）

已連接專案「Cityu canteen comment website」——評論即時全校共享，金鑰在 `app/js/config.js`（anon/publishable key 為公開金鑰，安全性由 RLS 政策保障）。

如要改用你自己的 Supabase 專案：到 [supabase.com](https://supabase.com) 開專案 → SQL Editor 依序執行 [`supabase-setup.sql`](supabase-setup.sql) 和 [`supabase-menu.sql`](supabase-menu.sql)（**記得執行 GRANT 語句**，否則匿名角色冇權讀寫）→ 把 Project URL 和 publishable/anon key 填入 `app/js/config.js`。

## 更新菜單的建議流程

1. 開學初去每個飯堂影低檔口菜牌（或官方點餐站）；
2. dashboard → Table Editor → `dishes`：改價錢、加菜、把消失了的菜 `available` 設為 `false`；
3. 菜品相片經 Storage → `dish-images` 上傳後把 URL 貼到 `photo` 欄；
4. 儲存後重新整理網站即生效——**毋須重新部署網站**。

## 技術

- 純 HTML／CSS／JS，無框架無 build step
- 設計 tokens 在 [`app/css/style.css`](app/css/style.css) 頂部（溫暖食誌風：奶油紙底 × 豉油墨 × 叉燒紅 × 蛋黃 × 瓷磚綠）
- 字體：Noto Serif TC（標題）· Noto Sans TC（內文）· Bricolage Grotesque（英文數字），Google Fonts 載入
- 評論儲存層介面在 [`app/js/reviews.js`](app/js/reviews.js)（LocalStore／SupabaseStore 同一介面，可再擴充其他後端）

## 免責聲明

學生自製網站，非官方。菜單與價錢以飯堂現場為準。與 CityU 無從屬關係。
