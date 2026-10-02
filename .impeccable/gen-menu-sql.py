# 生成 supabase-menu.sql（學校官方堂食菜單版）
import json, os

data = json.load(open('.impeccable/ac1-clean.json', encoding='utf-8'))
files = set(os.listdir('app/assets/ac1'))
for d in data['items']:
    if d['imgLocal']:
        base = d['imgLocal'][:-4]
        found = None
        for ext in ('.jpg', '.webp', '.png'):
            if os.path.basename(base + ext) in files:
                found = base + ext
                break
        d['imgLocal'] = found
json.dump(data, open('.impeccable/ac1-clean.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

GENERIC = [
    ('rice', 1, '中式飯類', 'Rice & Chinese'), ('noodle', 2, '粉麵', 'Noodles'),
    ('japanese', 3, '日韓', 'Japanese & Korean'), ('asian', 4, '東南亞', 'Southeast Asian'),
    ('western', 5, '西式', 'Western'), ('snack', 6, '小食', 'Snacks'), ('drinks', 7, '飲品甜品', 'Drinks & Dessert'),
]
cat_en = {
    '中式早點': 'Chinese Breakfast', '開學優惠': 'Term Deals', '肉燥拌麵': 'Minced Pork Noodles',
    '台式湯麵': 'Taiwanese Soup Noodles', '酸辣米線': 'Hot & Sour Mixian', '泰惹味精選': 'Thai Picks',
    '泰式湯粉': 'Thai Noodle Soup', '明爐燒味': 'Roast Meats', '燒味推介': 'Roast Recommendations',
    '燒味精選': 'Roast Selection', '城堡炸雞': 'Castle Fried Chicken', '披薩': 'Pizza',
    '特價燒味飯': 'Value Roast Rice', '豬扒包餐': 'Pork Chop Bun Set', '雞髀餐': 'Chicken Leg Set',
    '街頭碗仔羹': 'Street Bowl Soup', '西多士': 'French Toast', 'Coffee Lounge': 'Coffee Lounge',
    '單售食品': 'A La Carte', '特色飲品': 'Signature Drinks', '飲品': 'Drinks', '其他': 'Others',
}

def q(s):
    return 'null' if s is None else "'" + str(s).replace("'", "''") + "'"

L = []
A = L.append
A('-- ═══════════════════════════════════════════════════════════')
A('-- 城大搵食指南 v0.2.1 — 菜單雲端化（學校官方堂食菜單版）')
A('-- AC1 = 2026-10-02 從 csd.order.place 堂食菜單完整抄錄（109 項／22 分類）')
A('-- 分類改為資料表驅動；AC2/AC3 維持代表性資料')
A('-- 可重複執行（upsert / delete+insert）')
A('-- ═══════════════════════════════════════════════════════════')
A('')
A('-- ── 分類表（網站分類 chips 跟隨此表）──')
A('create table if not exists categories (')
A('  id    text primary key,')
A('  sort  int  not null default 0,')
A('  zh    text not null,')
A('  en    text not null')
A(');')
A('alter table categories enable row level security;')
A('drop policy if exists "categories are public" on categories;')
A('create policy "categories are public" on categories for select to anon, authenticated using (true);')
A('grant select on table categories to anon, authenticated;')
A('')
A('-- dishes.category 不再設限（分類由 categories 表管理）')
A('alter table dishes drop constraint if exists dishes_category_check;')
A('')
A('-- ── 分類種子：AC1 學校官方分類（22）＋ AC2/AC3 通用分類（7）──')
A('delete from categories;')
rows = []
for i, c in enumerate(data['cats']):
    rows.append(f"({q(c)}, {i+1}, {q(c)}, {q(cat_en.get(c, c))})")
for gid, srt, zh, en in GENERIC:
    rows.append(f"({q(gid)}, {100+srt}, {q(zh)}, {q(en)})")
A('insert into categories (id, sort, zh, en) values')
A(',\n'.join(rows) + ';')
A('')
A('-- ── 飯堂（同 v0.2.0）──')
CA = """insert into canteens (id, sort, zh, en, bldg_zh, bldg_en, hours_zh, hours_en, fact_zh, fact_en, photo, order_url) values
('ac1', 1, '城大食坊', 'City Express', '康樂樓 5 樓', '5/F, Amenities Building', '週一至五 07:30–20:00・週六至日 08:00–18:00（公眾假期休息）', 'Mon–Fri 07:30–20:00 · Sat–Sun 08:00–18:00 (PH closed)', '三個飯堂之中唯一有官方網上點餐的，車仔麵、燒味、日式丼一應俱全。', 'The only canteen with official online ordering — roast meats, noodles, donburi and more.', 'https://images.pexels.com/photos/2491286/pexels-photo-2491286.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://csd.order.place/home/store/112870'),
('ac2', 2, 'AC2 Canteen', 'AC2 Canteen', '李達三葉耀珍學術樓 3 樓', '3/F, Li Dak Sum Yip Yio Chin Academic Building', '週一至日 07:30–21:00（農曆新年休息）', 'Mon–Sun 07:30–21:00 (CNY closed)', '全校最大的 food court（860 座），$30 雙餸飯是城大傳說級抵食。', 'The biggest food court on campus (860 seats). The HK$30 two-dish rice is legendary value.', 'https://images.pexels.com/photos/4611422/pexels-photo-4611422.jpeg?auto=compress&cs=tinysrgb&w=900', null),
('ac3', 3, 'AC3 Bistro', 'AC3 Bistro', '劉鳴煒學術樓 7 樓', '7/F, Lau Ming Wai Academic Building', '週一至五 07:30–21:00（週日及公眾假期休息）', 'Mon–Fri 07:30–21:00 (Sun & PH closed)', '座落教學樓頂層的小 Bistro，人少安靜，吞拿魚披薩是鎮店之寶。', 'A quiet little bistro on the top teaching floors — the tuna pizza is the house icon.', 'https://images.pexels.com/photos/5112594/pexels-photo-5112594.jpeg?auto=compress&cs=tinysrgb&w=900', null)
on conflict (id) do update set sort = excluded.sort, zh = excluded.zh, en = excluded.en, bldg_zh = excluded.bldg_zh, bldg_en = excluded.bldg_en, hours_zh = excluded.hours_zh, hours_en = excluded.hours_en, fact_zh = excluded.fact_zh, fact_en = excluded.fact_en, photo = excluded.photo, order_url = excluded.order_url;"""
A(CA)
A('')
A('-- ── AC1 菜品：學校官方堂食菜單（109 項，照片為官方圖，存於 app/assets/ac1/）──')
A("delete from dishes where canteen_id = 'ac1';")
A('insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values')
dvals = []
for i, d in enumerate(data['items']):
    dvals.append(f"({q(d['id'])}, 'ac1', {q(d['cat'])}, {q(d['name'])}, null, {d['price']}, {q(d['imgLocal'])}, null, null, '{{}}', true, {i+1})")
A(',\n'.join(dvals) + ';')
A('')
A('-- ── AC2／AC3 菜品（代表性資料，不變）──')
A('insert into dishes (id, canteen_id, category, zh, en, price, photo, desc_zh, desc_en, tags, available, sort) values')
ac23 = [
    "('ac2-two-dish','ac2','rice','抵食雙餸飯','Two-Dish Rice (Legendarily Cheap)',30,'https://images.pexels.com/photos/2781537/pexels-photo-2781537.jpeg?auto=compress&cs=tinysrgb&w=900','$30 兩餸一飯，全城大最抵，中午排長龍。','Two dishes over rice for HK$30 — the best value on campus, queue at noon.','{signature,value}',true,1)",
    "('ac2-claypot','ac2','rice','北菇滑雞煲仔飯','Mushroom & Chicken Claypot Rice',38,'https://images.pexels.com/photos/1618873/pexels-photo-1618873.jpeg?auto=compress&cs=tinysrgb&w=900','秋冬限定，飯焦最正。','Autumn–winter special; the crispy bottom rice is the point.','{signature}',true,2)",
    "('ac2-mapo-tofu','ac2','rice','麻婆豆腐飯','Mapo Tofu Rice',26,null,null,null,'{spicy,value}',true,3)",
    "('ac2-yeungchow','ac2','rice','揚州炒飯','Yeung Chow Fried Rice',28,null,null,null,'{}',true,4)",
    "('ac2-beef-hofun','ac2','noodle','干炒牛河','Stir-fried Beef Flat Noodles',32,null,null,null,'{}',true,5)",
    "('ac2-satay-beef','ac2','noodle','沙嗲牛肉麵','Satay Beef Noodle Soup',28,null,null,null,'{}',true,6)",
    "('ac2-mango-shrimp','ac2','asian','凍芒果蝦沙律','Chilled Mango Shrimp Salad',28,'https://images.pexels.com/photos/6990080/pexels-photo-6990080.jpeg?auto=compress&cs=tinysrgb&w=900','AC2 名物，夏天一流。','The AC2 signature — perfect in summer.','{signature}',true,7)",
    "('ac2-curry-brisket','ac2','asian','咖喱牛腩飯','Curry Beef Brisket Rice',34,null,null,null,'{spicy}',true,8)",
    "('ac2-salt-chicken-wing','ac2','snack','椒鹽雞翼','Salt & Pepper Chicken Wings',22,null,null,null,'{}',true,9)",
    "('ac2-milk-tea','ac2','drinks','凍檸檬茶','Iced Lemon Tea',9,null,null,null,'{}',true,10)",
    "('ac3-tuna-pizza','ac3','western','吞拿魚披薩','Tuna Pizza',42,'https://images.pexels.com/photos/5175556/pexels-photo-5175556.jpeg?auto=compress&cs=tinysrgb&w=900','AC3 鎮店之寶，經常售罄。','The house icon — often sells out.','{signature}',true,1)",
    "('ac3-carbonara','ac3','western','卡邦尼意粉','Spaghetti Carbonara',38,'https://images.pexels.com/photos/546945/pexels-photo-546945.jpeg?auto=compress&cs=tinysrgb&w=900',null,null,'{}',true,2)",
    "('ac3-bolognese','ac3','western','肉醬意粉','Spaghetti Bolognese',36,'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=900',null,null,'{}',true,3)",
    "('ac3-chicken-sandwich','ac3','western','烤雞三文治','Roast Chicken Sandwich',32,'https://images.pexels.com/photos/2161636/pexels-photo-2161636.jpeg?auto=compress&cs=tinysrgb&w=900',null,null,'{}',true,4)",
    "('ac3-udon','ac3','japanese','海鮮烏冬','Seafood Udon',36,null,null,null,'{}',true,5)",
    "('ac3-latte','ac3','drinks','鮮奶咖啡','Latte',24,'https://images.pexels.com/photos/5591737/pexels-photo-5591737.jpeg?auto=compress&cs=tinysrgb&w=900',null,null,'{}',true,6)",
]
A(',\n'.join(ac23))
A('on conflict (id) do update set category = excluded.category, zh = excluded.zh, en = excluded.en, price = excluded.price, photo = excluded.photo, desc_zh = excluded.desc_zh, desc_en = excluded.desc_en, tags = excluded.tags, available = excluded.available, sort = excluded.sort;')

open('supabase-menu.sql', 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print('written:', len('\n'.join(L)), 'chars |', len(data['items']), 'AC1 dishes |', len(data['cats']) + 7, 'categories | photo:', sum(1 for d in data['items'] if d['imgLocal']))
