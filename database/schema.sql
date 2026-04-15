create extension if not exists "pgcrypto";

create table if not exists schools (
  id text primary key,
  name text not null,
  slug text unique,
  board text not null,
  city text not null,
  district text not null,
  state text not null default 'Uttarakhand',
  category text not null check (category in ('private', 'government')),
  medium text not null,
  logo_url text,
  cover_image_url text,
  created_at timestamptz not null default now()
);

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  school_id text not null references schools(id) on delete cascade,
  grade text not null,
  section text,
  academic_year text not null,
  active_syllabus_version_id uuid,
  created_at timestamptz not null default now()
);
create unique index if not exists idx_classes_unique_school_grade_section_year on classes (school_id, grade, coalesce(section, ''), academic_year);

create table if not exists master_book_catalog (
  id uuid primary key default gen_random_uuid(),
  work_key text not null,
  isbn13 text unique,
  title text not null,
  subject text not null,
  publisher text not null,
  language text not null,
  binding text,
  cover_image_url text,
  created_at timestamptz not null default now()
);

create table if not exists book_editions (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references master_book_catalog(id) on delete cascade,
  edition_label text,
  publication_year int,
  cover_hash text,
  page_count int,
  created_at timestamptz not null default now()
);

create table if not exists syllabus_versions (
  id uuid primary key default gen_random_uuid(),
  school_id text not null references schools(id) on delete cascade,
  class_id uuid references classes(id) on delete cascade,
  academic_year text not null,
  version_label text not null,
  status text not null check (status in ('draft', 'active', 'archived')),
  source_type text default 'manual',
  verified_by text,
  created_at timestamptz not null default now()
);

create table if not exists syllabus_mapper (
  id uuid primary key default gen_random_uuid(),
  syllabus_version_id uuid not null references syllabus_versions(id) on delete cascade,
  slot_no int not null,
  subject text not null,
  book_role text default 'core',
  is_mandatory boolean not null default true,
  accepted_book_id uuid references master_book_catalog(id),
  accepted_edition_id uuid references book_editions(id),
  confidence_score numeric(5,2) default 1,
  created_at timestamptz not null default now()
);

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text not null,
  password_hash text not null,
  role text not null default 'parent' check (role in ('parent', 'driver')),
  created_at timestamptz not null default now()
);

create table if not exists app_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists driver_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references app_users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  city text not null,
  service_areas text[] not null default '{}',
  vehicle_type text not null,
  availability_status text not null default 'offline' check (availability_status in ('available', 'busy', 'offline')),
  accepts_pickup boolean not null default true,
  accepts_delivery boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists seller_submissions (
  id text primary key default ('sub-' || floor(extract(epoch from now()) * 1000)::bigint::text),
  user_id uuid references app_users(id) on delete set null,
  seller_name text not null,
  phone text not null,
  sell_mode text not null default 'kit' check (sell_mode in ('single_book', 'kit')),
  school_name text not null,
  requested_school_name text,
  class_label text not null,
  academic_year text not null,
  book_title text,
  subject_label text,
  pickup_mode text not null check (pickup_mode in ('home_pickup', 'school_drive')),
  notes text,
  status text not null default 'pickup_scheduled' check (status in ('pickup_scheduled', 'received', 'graded', 'settled')),
  pickup_status text not null default 'pending_assignment' check (pickup_status in ('pending_assignment', 'assigned', 'picked_up')),
  pickup_driver_id uuid references driver_profiles(id) on delete set null,
  assigned_to text,
  analysis_status text not null default 'queued' check (analysis_status in ('queued', 'uploading', 'creating_submission', 'processing', 'reviewed')),
  photo_count int not null default 0,
  estimated_payout_min numeric(10,2) not null default 0,
  estimated_payout_max numeric(10,2) not null default 0,
  final_offer numeric(10,2) not null default 0,
  status_note text,
  accepted_items int not null default 0,
  rejected_items int not null default 0,
  payout numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists seller_submission_photos (
  id uuid primary key default gen_random_uuid(),
  submission_id text not null references seller_submissions(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  submission_item_id uuid,
  book_id uuid references master_book_catalog(id),
  edition_id uuid references book_editions(id),
  grade text check (grade in ('A+', 'A', 'B')),
  qc_status text default 'pending',
  refurb_status text default 'pending',
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);

create table if not exists kit_bundles (
  id text primary key,
  school_name text not null,
  class_label text not null,
  academic_year text not null,
  completion_pct int not null,
  quality_band text not null,
  savings_pct int not null,
  used_item_count int not null,
  new_item_count int not null,
  total_books int not null,
  price numeric(10,2) not null,
  retail_price numeric(10,2) not null,
  hero_badge text,
  status text not null check (status in ('verified', 'partial', 'waitlist')),
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key default ('ord-' || floor(extract(epoch from now()) * 1000)::bigint::text),
  user_id uuid references app_users(id) on delete set null,
  kit_id text references kit_bundles(id) on delete set null,
  buyer_name text not null,
  phone text not null,
  school_name text not null,
  class_label text not null,
  delivery_address text not null,
  delivery_mode text not null check (delivery_mode in ('home', 'school')),
  payment_mode text not null check (payment_mode in ('booking', 'full', 'cod')),
  total_amount numeric(10,2) not null,
  delivery_driver_id uuid references driver_profiles(id) on delete set null,
  fulfillment_status text not null default 'confirmed' check (fulfillment_status in ('confirmed', 'packed', 'out_for_delivery', 'delivered')),
  delivery_window text not null default 'We will confirm your delivery slot shortly',
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  task_type text not null,
  entity_type text not null,
  entity_id text not null,
  assigned_to text,
  status text not null default 'pending',
  scheduled_for timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_seller_submissions_created_at on seller_submissions (created_at desc);
create index if not exists idx_seller_submissions_user_id on seller_submissions (user_id, created_at desc);
create index if not exists idx_orders_created_at on orders (created_at desc);
create index if not exists idx_orders_user_id on orders (user_id, created_at desc);
create index if not exists idx_kit_bundles_school_class on kit_bundles (school_name, class_label);
create index if not exists idx_app_sessions_user_id on app_sessions (user_id);
create index if not exists idx_submission_photos_submission_id on seller_submission_photos (submission_id);
create index if not exists idx_driver_profiles_user_id on driver_profiles (user_id);

alter table schools enable row level security;
alter table classes enable row level security;
alter table master_book_catalog enable row level security;
alter table book_editions enable row level security;
alter table syllabus_versions enable row level security;
alter table syllabus_mapper enable row level security;
alter table app_users enable row level security;
alter table app_sessions enable row level security;
alter table driver_profiles enable row level security;
alter table seller_submissions enable row level security;
alter table seller_submission_photos enable row level security;
alter table inventory enable row level security;
alter table kit_bundles enable row level security;
alter table orders enable row level security;
alter table tasks enable row level security;

drop policy if exists "public read schools" on schools;
drop policy if exists "public read kits" on kit_bundles;
drop policy if exists "service manage app users" on app_users;
drop policy if exists "service manage app sessions" on app_sessions;
drop policy if exists "service manage driver profiles" on driver_profiles;
drop policy if exists "service manage submissions" on seller_submissions;
drop policy if exists "service manage submission photos" on seller_submission_photos;
drop policy if exists "service manage orders" on orders;
drop policy if exists "service manage schools" on schools;
drop policy if exists "service manage kits" on kit_bundles;

create policy "public read schools" on schools for select using (true);
create policy "public read kits" on kit_bundles for select using (true);
create policy "service manage app users" on app_users for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service manage app sessions" on app_sessions for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service manage driver profiles" on driver_profiles for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service manage submissions" on seller_submissions for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service manage submission photos" on seller_submission_photos for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service manage orders" on orders for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service manage schools" on schools for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service manage kits" on kit_bundles for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

alter table app_users add column if not exists role text not null default 'parent';
alter table seller_submissions add column if not exists sell_mode text not null default 'kit';
alter table seller_submissions add column if not exists book_title text;
alter table seller_submissions add column if not exists subject_label text;
alter table seller_submissions add column if not exists pickup_driver_id uuid references driver_profiles(id) on delete set null;
alter table orders add column if not exists delivery_driver_id uuid references driver_profiles(id) on delete set null;
