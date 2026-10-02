/* 城大搵食指南 CityU Eats — 站點設定
 *
 * 評論儲存方式：
 *   預設用 localStorage（每個瀏覽器各自儲存，零設定即用）。
 *   想開啟全校共享評論 → 到 supabase.com 免費開一個專案，執行根目錄的
 *   supabase-setup.sql，然後把下面 SUPABASE_URL 和 SUPABASE_ANON_KEY 填上。
 */
window.CITYU_EATS_CONFIG = {
  // Supabase project: Cityu canteen comment website (2026-10-02 連接)
  SUPABASE_URL: 'https://dymeaqrkvpqmocicpnsx.supabase.co',
  // anon / publishable key — 公開金鑰，安全性由 RLS 政策保障
  SUPABASE_ANON_KEY: 'sb_publishable_z6S7TJU_fCD6aFWn9UY0Ug__5YKeJSD',
  SUPABASE_TABLE: 'reviews',

  // 設為 true 可隱藏種子範例評論（等於別人按了「隱藏範例資料」）
  HIDE_SAMPLES: false,

  STORAGE_KEY: 'cityu-eats:reviews:v1',
  LANG_KEY: 'cityu-eats:lang',
  SAMPLES_KEY: 'cityu-eats:hide-samples',
};
