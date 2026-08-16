-- ============================================================
-- سكيما قاعدة بيانات موقع يارا
-- انسخي الكود ده كله والصقيه في Supabase Dashboard > SQL Editor
-- وبعدين دوسي Run
-- ============================================================

-- 1) جدول إعدادات الموقع (صف واحد بس)
create table if not exists site_settings (
  id int primary key default 1,
  gate_password text not null default '123',
  song_url text,
  voice_url text,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

insert into site_settings (id, gate_password)
values (1, '123')
on conflict (id) do nothing;

-- لو الجدول ده كان عندك موجود من قبل (شغال بالفعل ومعمولك عليه بيانات)،
-- شغّلي السطر ده لوحده عشان تضيفي عمود المحتوى الجديد من غير ما تفقدي أي بيانات:
alter table site_settings add column if not exists content jsonb not null default '{}'::jsonb;

-- 2) جدول صور المعرض
create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text not null default '',
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- 3) تفعيل RLS
alter table site_settings enable row level security;
alter table gallery_photos enable row level security;

-- القراءة متاحة للجميع (عشان الموقع يشتغل بدون تسجيل دخول)
create policy "قراءة عامة للإعدادات" on site_settings
  for select using (true);

create policy "قراءة عامة للصور" on gallery_photos
  for select using (true);

-- التعديل متاح بس للمستخدم المسجل دخول (أنت، الأدمن)
create policy "تعديل الإعدادات للأدمن فقط" on site_settings
  for update using (auth.role() = 'authenticated');

create policy "إضافة صور للأدمن فقط" on gallery_photos
  for insert with check (auth.role() = 'authenticated');

create policy "حذف صور للأدمن فقط" on gallery_photos
  for delete using (auth.role() = 'authenticated');

create policy "تعديل صور للأدمن فقط" on gallery_photos
  for update using (auth.role() = 'authenticated');

-- ============================================================
-- 4) إعداد Storage Buckets
-- روحي Storage من القائمة الجانبية وأنشئي 3 buckets بالأسماء دي بالظبط،
-- وخليهم Public من إعدادات كل bucket:
--   gallery-images
--   site-music
--   voice-messages
--
-- بعد إنشاء كل bucket، ارجعي هنا ونفذي السطور دي عشان تسمحي
-- للأدمن بس (المسجل دخول) يرفع أو يمسح ملفات:
-- ============================================================

create policy "قراءة عامة لملفات الصور"
on storage.objects for select
using (bucket_id = 'gallery-images');

create policy "رفع صور للأدمن فقط"
on storage.objects for insert
with check (bucket_id = 'gallery-images' and auth.role() = 'authenticated');

create policy "حذف صور للأدمن فقط"
on storage.objects for delete
using (bucket_id = 'gallery-images' and auth.role() = 'authenticated');

create policy "قراءة عامة للموسيقى"
on storage.objects for select
using (bucket_id = 'site-music');

create policy "رفع موسيقى للأدمن فقط"
on storage.objects for insert
with check (bucket_id = 'site-music' and auth.role() = 'authenticated');

create policy "حذف موسيقى للأدمن فقط"
on storage.objects for delete
using (bucket_id = 'site-music' and auth.role() = 'authenticated');

create policy "قراءة عامة للرسايل الصوتية"
on storage.objects for select
using (bucket_id = 'voice-messages');

create policy "رفع رسايل صوتية للأدمن فقط"
on storage.objects for insert
with check (bucket_id = 'voice-messages' and auth.role() = 'authenticated');

create policy "حذف رسايل صوتية للأدمن فقط"
on storage.objects for delete
using (bucket_id = 'voice-messages' and auth.role() = 'authenticated');
