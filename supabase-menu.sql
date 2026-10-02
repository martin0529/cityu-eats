-- ═══════════════════════════════════════════════════════════
-- 城大搵食指南 — 菜單雲端化（canteens / dishes / 圖片 storage）
-- 喺 Supabase SQL Editor 執行一次即可；種子段可重複執行（upsert）
-- 之後改菜單：dashboard → Table Editor → dishes／canteens 直接改
-- ═══════════════════════════════════════════════════════════

create table if not exists canteens (
  id         text primary key,
  sort       int  not null default 0,
  zh         text not null,
  en         text not null,
  bldg_zh    text,
  bldg_en    text,
  hours_zh   text,
  hours_en   text,
  fact_zh    text,
  fact_en    text,
  photo      text,
  order_url  text
);

create table if not exists dishes (
  id          text primary key,
  canteen_id  text not null references canteens(id),
  category    text not null check (category in ('rice','noodle','japanese','asian','western','snack','drinks')),
  zh          text not null,
  en          text not null,
  price       numeric not null check (price >= 0),
  photo       text,
  desc_zh     text,
  desc_en     text,
  tags        text[] not null default '{}',
  available   boolean not null default true,
  sort        int not null default 0,
  updated_at  timestamptz not null default now()
);

create index if not exists dishes_canteen_idx on dishes (canteen_id, sort);

-- 訪客只讀；修改一律經 dashboard（Table Editor 用你的登入身份，不受 RLS 限制）
alter table canteens enable row level security;
alter table dishes   enable row level security;
drop policy if exists "menus are public" on canteens;
create policy "menus are public" on canteens for select to anon, authenticated using (true);
drop policy if exists "menus are public" on dishes;
create policy "menus are public" on dishes for select to anon, authenticated using (true);

grant usage on schema public to anon, authenticated;
grant select on table canteens, dishes to anon, authenticated;

-- ───── 圖片儲存桶（dashboard → Storage → dish-images 上傳菜品相）─────
insert into storage.buckets (id, name, public)
values ('dish-images', 'dish-images', true)
on conflict (id) do nothing;
drop policy if exists "dish images are public" on storage.objects;
create policy "dish images are public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'dish-images');

-- ───── 種子資料：由 app/js/menu-data.js 生成（upsert，可重複執行）─────
insert into canteens (id, sort, zh, en, bldg_zh, bldg_en, hours_zh, hours_en, fact_zh, fact_en, photo, order_url) values
('ac1', 1, '城大食坊', 'City Express', '康樂樓 5 樓', '5/F, Amenities Building', '週一至五 07:30–20:00・週六至日 08:00–18:00（公眾假期休息）', 'Mon–Fri 07:30–20:00 · Sat–Sun 08:00–18:00 (PH closed)', '三個飯堂之中唯一有官方網上點餐的，車仔麵、燒味、日式丼一應俱全。', 'The only canteen with official online ordering — roast meats, noodles, donburi and more.', 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://csd.order.place/home/store/112870'),
('ac2', 2, 'AC2 Canteen', 'AC2 Canteen', '李達三葉耀珍學術樓 3 樓', '3/F, Li Dak Sum Yip Yio Chin Academic Building', '週一至日 07:30–21:00（農曆新年休息）', 'Mon–Sun 07:30–21:00 (CNY closed)', '全校最大的 food court（860 座），$30 雙餸飯是城大傳說級抵食。', 'The biggest food court on campus (860 seats). The HK$30 two-dish rice is legendary value.', 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null),
('ac3', 3, 'AC3 Bistro', 'AC3 Bistro', '劉鳴煒學術樓 7 樓', '7/F, Lau Ming Wai Academic Building', '週一至五 07:30–21:00（週日及公眾假期休息）', 'Mon–Fri 07:30–21:00 (Sun & PH closed)', '座落教學樓頂層的小 Bistro，人少安靜，吞拿魚披薩是鎮店之寶。', 'A quiet little bistro on the top teaching floors — the tuna pizza is the house icon.', 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null)
on conflict (id) do update set sort = excluded.sort, zh = excluded.zh, en = excluded.en, bldg_zh = excluded.bldg_zh, bldg_en = excluded.bldg_en, hours_zh = excluded.hours_zh, hours_en = excluded.hours_en, fact_zh = excluded.fact_zh, fact_en = excluded.fact_en, photo = excluded.photo, order_url = excluded.order_url;

insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values
('ac1-sampan-fan', 'ac1', 'rice', '鹹蛋三寶飯', 'Salted Egg Three-Treasure Rice', 32.7, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', '鹹蛋＋三款小菜鋪面，一盒滿足。', 'Salted egg and three toppings over rice — a full box of comfort.', array['value'], true, 1),
('ac1-dual-roast', 'ac1', 'rice', '燒味雙拼飯', 'Dual Roast Meat Rice', 28.6, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', '即燒叉燒／燒鴨任揀兩款，飯堂主打。', 'Pick two from char siu, roast duck and more — the canteen''s headliner.', array['signature','value'], true, 2),
('ac1-single-roast', 'ac1', 'rice', '燒味單拼飯', 'Roast Meat Rice', 22, null, '最平價的燒味飯，窮學生恩物。', 'The cheapest roast rice on campus — a broke-student staple.', array['value'], true, 3),
('ac1-duck-spicy', 'ac1', 'rice', '麻辣肉丁‧明爐燒鴨飯', 'Spicy Diced Pork & Roast Duck Rice', 44, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null, null, array['spicy'], true, 4),
('ac1-koushui-chicken', 'ac1', 'rice', '口水雞‧白飯', 'Mouth-watering Chicken & Rice', 40.9, null, null, null, array['spicy'], true, 5),
('ac1-beef-noodle', 'ac1', 'noodle', '台式麻辣牛肉麵', 'Taiwanese Spicy Beef Noodle Soup', 43, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', '湯頭濃、牛肉大件，冬天必食。', 'Rich broth and thick-cut beef — a winter must.', array['spicy','signature'], true, 6),
('ac1-suanla-mixian', 'ac1', 'noodle', '酸辣米線', 'Hot & Sour Rice Noodles', 22.5, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null, null, array['spicy','value'], true, 7),
('ac1-duck-hofun', 'ac1', 'noodle', '鴨腿湯河粉', 'Duck Leg Rice Noodle Soup', 39, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null, null, '{}', true, 8),
('ac1-fishball-fun', 'ac1', 'noodle', '魚蛋湯粉', 'Fish Ball Noodle Soup', 29.7, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null, null, array['value'], true, 9),
('ac1-mushroom-noodle', 'ac1', 'noodle', '豉油皇菇絲炒麵', 'Soy Sauce Mushroom Noodles', 12.5, null, '十二蚊有交易，抵食之最。', 'Twelve dollars fifty — unbeatable value.', array['value'], true, 10),
('ac1-beef-don', 'ac1', 'japanese', '洋蔥牛肉丼', 'Beef & Onion Donburi', 49.1, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null, null, array['signature'], true, 11),
('ac1-onsen-don', 'ac1', 'japanese', '汁煮豚肉‧溫泉玉子丼', 'Simmered Pork & Onsen Egg Donburi', 49.1, null, null, null, '{}', true, 12),
('ac1-curry-katsu', 'ac1', 'japanese', '咖喱唐揚雞飯', 'Curry Fried Chicken Rice', 51.2, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', '日式咖喱配炸雞，飯堂日系代表。', 'Japanese curry with fried chicken — the Japanese corner''s star.', array['signature'], true, 13),
('ac1-teriyaki-udon', 'ac1', 'japanese', '照燒雞扒烏冬', 'Teriyaki Chicken Udon', 46, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null, null, '{}', true, 14),
('ac1-thai-chicken', 'ac1', 'asian', '泰式水門雞飯‧例湯', 'Thai Hainanese Chicken Rice & Soup', 49.1, null, null, null, '{}', true, 15),
('ac1-lemongrass-leg', 'ac1', 'asian', '香茅雞髀‧油飯', 'Lemongrass Chicken Leg & Oiled Rice', 38.9, null, null, null, '{}', true, 16),
('ac1-cha-lau-fan', 'ac1', 'asian', '扎肉‧肉燥飯', 'Vietnamese Pork & Minced Pork Rice', 39, null, null, null, '{}', true, 17),
('ac1-thai-fishcake', 'ac1', 'asian', '泰式魚餅‧肉燥飯', 'Thai Fish Cake & Minced Pork Rice', 39, null, null, null, '{}', true, 18),
('ac1-pepperoni', 'ac1', 'western', '辣肉腸披薩', 'Pepperoni Pizza', 49.1, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', '即叫即整，等 15–20 分鐘，抵等。', 'Made to order in 15–20 minutes — worth the wait.', array['signature'], true, 19),
('ac1-hawaii-pizza', 'ac1', 'western', '夏威夷菠蘿火腿芝士披薩', 'Hawaiian Pineapple Ham Cheese Pizza', 49.1, null, null, null, '{}', true, 20),
('ac1-porkchop-bun', 'ac1', 'snack', '芥末吉列豬扒包‧薯條', 'Wasabi Katsu Pork Chop Bun & Fries', 36.8, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', '豬扒炸到脆身，配薯條一個飽餐。', 'Crispy katsu pork chop in a bun with fries.', '{}', true, 21),
('ac1-fried-chicken', 'ac1', 'snack', '炸雞髀‧薯條', 'Fried Chicken Leg & Fries', 28.6, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null, null, '{}', true, 22),
('ac1-french-toast', 'ac1', 'snack', '西多士', 'Hong Kong French Toast', 24.6, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', '茶記經典，下午茶之魂。', 'The cha chaan teng classic — afternoon tea''s soul.', array['sweet'], true, 23),
('ac1-wun-jai-gee', 'ac1', 'snack', '碗仔翅', 'Street-style "Shark Fin" Soup', 18, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null, null, array['value'], true, 24),
('ac1-iced-milktea', 'ac1', 'drinks', '凍奶茶', 'Iced Milk Tea', 7.5, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', '七蚊半一杯，全場最抵。', 'Seven fifty a cup — the best deal in the building.', array['signature','value'], true, 25),
('ac1-iced-yuenyeung', 'ac1', 'drinks', '凍鴛鴦', 'Iced Yuenyeung (Tea-Coffee Mix)', 7.5, null, null, null, array['value'], true, 26),
('ac1-latte-large', 'ac1', 'drinks', '大凍鮮奶咖啡（16oz）', 'Large Iced Latte (16oz)', 30.7, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null, null, '{}', true, 27),
('ac2-two-dish', 'ac2', 'rice', '抵食雙餸飯', 'Two-Dish Rice (Legendarily Cheap)', 30, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', '$30 兩餸一飯，全城大最抵，中午排長龍。', 'Two dishes over rice for HK$30 — the best value on campus, queue at noon.', array['signature','value'], true, 28),
('ac2-claypot', 'ac2', 'rice', '北菇滑雞煲仔飯', 'Mushroom & Chicken Claypot Rice', 38, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', '秋冬限定，飯焦最正。', 'Autumn–winter special; the crispy bottom rice is the point.', array['signature'], true, 29),
('ac2-mapo-tofu', 'ac2', 'rice', '麻婆豆腐飯', 'Mapo Tofu Rice', 26, null, null, null, array['spicy','value'], true, 30),
('ac2-yeungchow', 'ac2', 'rice', '揚州炒飯', 'Yeung Chow Fried Rice', 28, null, null, null, '{}', true, 31),
('ac2-beef-hofun', 'ac2', 'noodle', '干炒牛河', 'Stir-fried Beef Flat Noodles', 32, null, null, null, '{}', true, 32),
('ac2-satay-beef', 'ac2', 'noodle', '沙嗲牛肉麵', 'Satay Beef Noodle Soup', 28, null, null, null, '{}', true, 33),
('ac2-mango-shrimp', 'ac2', 'asian', '凍芒果蝦沙律', 'Chilled Mango Shrimp Salad', 28, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', 'AC2 名物，夏天一流。', 'The AC2 signature — perfect in summer.', array['signature'], true, 34),
('ac2-curry-brisket', 'ac2', 'asian', '咖喱牛腩飯', 'Curry Beef Brisket Rice', 34, null, null, null, array['spicy'], true, 35),
('ac2-salt-chicken-wing', 'ac2', 'snack', '椒鹽雞翼', 'Salt & Pepper Chicken Wings', 22, null, null, null, '{}', true, 36),
('ac2-milk-tea', 'ac2', 'drinks', '凍檸檬茶', 'Iced Lemon Tea', 9, null, null, null, '{}', true, 37),
('ac3-tuna-pizza', 'ac3', 'western', '吞拿魚披薩', 'Tuna Pizza', 42, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', 'AC3 鎮店之寶，經常售罄。', 'The house icon — often sells out.', array['signature'], true, 38),
('ac3-carbonara', 'ac3', 'western', '卡邦尼意粉', 'Spaghetti Carbonara', 38, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null, null, '{}', true, 39),
('ac3-bolognese', 'ac3', 'western', '肉醬意粉', 'Spaghetti Bolognese', 36, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null, null, '{}', true, 40),
('ac3-chicken-sandwich', 'ac3', 'western', '烤雞三文治', 'Roast Chicken Sandwich', 32, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null, null, '{}', true, 41),
('ac3-udon', 'ac3', 'japanese', '海鮮烏冬', 'Seafood Udon', 36, null, null, null, '{}', true, 42),
('ac3-latte', 'ac3', 'drinks', '鮮奶咖啡', 'Latte', 24, 'https://images.pexels.com/photos/undefined/pexels-photo-undefined.jpeg?auto=compress&cs=tinysrgb&w=900', null, null, '{}', true, 43)
on conflict (id) do update set canteen_id = excluded.canteen_id, category = excluded.category, zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo, desc_zh = excluded.desc_zh, desc_en = excluded.desc_en, tags = excluded.tags, available = excluded.available, sort = excluded.sort;
