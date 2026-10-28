-- ==============================================================================
-- COGNISACRA SOVEREIGN ACADEMY & INSTITUTIONAL NETWORK
-- Production-Ready Supabase PostgreSQL Schema & Security Architecture
-- ==============================================================================
-- Designed for 3 primary roles: 'learner', 'instructor', 'institution'
-- Features:
--  1. Supabase Auth integration (automated profile provisioning & role routing)
--  2. Granular Row Level Security (RLS) policies for multi-tenant privacy & sovereign access
--  3. Course Authoring, Hierarchical Modules, Lessons, and Student Enrollment Tracking
--  4. Blockchain Sovereign Credentials, Verifiable Diplomas & W3C Transcripts
--  5. Multi-Campus Institutional Accreditation Roster & Code Redemption
--  6. Faculty Mentorship Office Hours & Advisory Booking Engine
--  7. Gamification, Badges, Achievements & Community Interaction Feed
--  8. Automated updated_at triggers, indexing, and Supabase Realtime publication
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. BASE USER PROFILES (Extension of auth.users)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  role text not null check (role in ('learner', 'instructor', 'institution')) default 'learner',
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 2. ROLE-SPECIFIC PROFILES
-- ------------------------------------------------------------------------------

-- 2.1 Learners Data
create table if not exists public.learners_data (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  username text unique,
  display_name text,
  bio text,
  title text default 'Scholar & Lifelong Learner',
  cover_image_url text default 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80',
  location_city text default 'Nairobi',
  location_country text default 'Kenya',
  skills text[] default array['Distributed Systems', 'PostgreSQL', 'Cognitive AI', 'TypeScript'],
  social_links jsonb default '{"linkedin": "", "github": "", "portfolio": ""}'::jsonb,
  education jsonb default '[]'::jsonb,
  learning_goals text[] default array['Master Distributed Systems', 'Publish Neural Research Paper'],
  mentorship_status text check (mentorship_status in ('seeking', 'offering', 'none')) default 'none',
  target_career text default 'Distributed Systems Architect',
  academic_institution text default 'CogniSacra Sovereign Academic Network',
  office_hours text,
  hourly_rate numeric(10, 2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.2 Instructors Data
create table if not exists public.instructors_data (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  display_name text,
  title text default 'Professor of Distributed Computing & Lead Curriculum Architect',
  bio text,
  academic_institution text default 'CogniSacra Faculty & Research Guild',
  location_city text default 'Nairobi',
  location_country text default 'Kenya',
  social_links jsonb default '{"linkedin": "", "github": "", "portfolio": ""}'::jsonb,
  accreditations text[] default array['ISO/IEC 17024 Academic Assessor', 'Regional Higher Education Fellow'],
  licenses text[] default array[],
  resume_url text,
  office_hours text default 'Tuesdays & Thursdays, 14:00 - 16:00 GMT',
  hourly_rate numeric(10, 2) default 85.00,
  mentorship_status text check (mentorship_status in ('seeking', 'offering', 'none')) default 'offering',
  payout_settings jsonb default '{"method": "crypto_sovereign", "currency": "USD", "walletAddress": ""}'::jsonb,
  notification_settings jsonb default '{"studentJoins": true, "courseReviews": true, "newEnrollments": true, "mentorshipRequests": true}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.3 Institutions Data
create table if not exists public.institutions_data (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  name text not null default 'CogniSacra Sovereign Academy & Research Institute',
  tagline text default 'Pioneering sovereign higher education and accredited continental learning credentials.',
  about text default 'CogniSacra Academy is a chartered sovereign institution deploying accredited AI, neural computing, and distributed ledger curricula across Africa and partner continents.',
  banner_url text default 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80',
  website text default 'https://cognisacra.io',
  contact_email text default 'admissions@cognisacra.edu',
  contact_phone text default '+254 20 790 4000',
  branding_logo_url text default 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&q=80',
  branding_primary_color text default '#10B981',
  branding_secondary_color text default '#0E131C',
  locations jsonb default '[{"id": "loc-1", "name": "Main Campus (Nairobi)", "address": "Kilimani Sovereign Science Park, Nairobi, Kenya"}, {"id": "loc-2", "name": "West Africa Hub (Accra)", "address": "Airport City, Accra, Ghana"}]'::jsonb,
  programs jsonb default '[{"id": "prg-1", "title": "B.Sc. Distributed Systems & Autonomous Agents", "type": "Degree", "description": "4-year accredited degree with on-chain cryptographic diploma."}, {"id": "prg-2", "title": "Postgraduate Micro-Credential in Neural Engineering", "type": "Micro-Credential", "description": "12-week high-yield sovereign compute certificate."}]'::jsonb,
  faculty jsonb default '[]'::jsonb,
  mentorship_program jsonb default '{"enabled": true, "coordinator": "Faculty Deans Office", "officeHours": []}'::jsonb,
  settings jsonb default '{"whiteLabel": false, "multiLanguage": true, "profileVisibility": "public"}'::jsonb,
  monetization_settings jsonb default '{"tuitionCurrency": "USD", "installmentAvailable": true}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 3. USER PREFERENCES & PLATFORM SETTINGS
-- ------------------------------------------------------------------------------
create table if not exists public.user_settings (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  account_settings jsonb default '{"twoFactorEnabled": false, "connectedAccounts": ["google"]}'::jsonb,
  learning_preferences jsonb default '{"language": "en", "subtitles": true, "videoSpeed": 1, "videoQuality": "1080p", "autoPlay": false}'::jsonb,
  notification_preferences jsonb default '{"reminders": true, "certificates": true, "offers": false, "forum": "highlights"}'::jsonb,
  privacy_settings jsonb default '{"profileVisibility": "public", "showCompletedCourses": true, "showAchievements": true}'::jsonb,
  payment_settings jsonb default '{"plan": "Standard Scholar", "paymentMethods": []}'::jsonb,
  accessibility_settings jsonb default '{"highContrast": false, "textSize": "base"}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 4. COURSES, MODULES & LESSONS
-- ------------------------------------------------------------------------------
create table if not exists public.courses (
  id text not null primary key,
  title text not null,
  category text not null,
  description text default '',
  instructor_id uuid references public.profiles(id) on delete set null,
  instructor_name text not null,
  instructor_image text,
  image_url text not null,
  level text check (level in ('Beginner', 'Intermediate', 'Advanced')) default 'Beginner',
  price numeric(10, 2) default 0.00,
  price_type text check (price_type in ('free', 'one-time', 'subscription')) default 'free',
  duration text default '10 hours',
  university text,
  university_logo text,
  learning_outcomes text[] default array[]::text[],
  video_trailer_url text,
  status text check (status in ('active', 'upcoming', 'archived')) default 'active',
  status_label text check (status_label in ('Self-Paced', 'Online', 'Archived', 'Coming Soon')) default 'Self-Paced',
  is_draft boolean default false,
  offered_by text check (offered_by in ('instructor', 'institution')) default 'instructor',
  institution_id uuid references public.institutions_data(id) on delete set null,
  faculty_name text,
  campus_name text,
  qualification_type text default 'Accredited Micro-Credential',
  rating numeric(3, 2) default 4.85,
  reviews_count integer default 142,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.modules (
  id text not null primary key,
  course_id text references public.courses(id) on delete cascade not null,
  title text not null,
  order_index integer not null default 0,
  prerequisites text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.lessons (
  id text not null primary key,
  module_id text references public.modules(id) on delete cascade not null,
  course_id text references public.courses(id) on delete cascade not null,
  title text not null,
  duration text default '15 mins',
  description text,
  format text check (format in ('video', 'reading', 'quiz', 'adaptive-quiz', 'project', 'live-session', 'metaverse')) default 'video',
  content text,
  video_url text,
  transcript text,
  is_locked boolean default false,
  deadline timestamp with time zone,
  checklist jsonb default '[]'::jsonb,
  resources jsonb default '[]'::jsonb,
  questions jsonb default '[]'::jsonb,
  order_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 5. COURSE ENROLLMENTS & LESSON PROGRESS
-- ------------------------------------------------------------------------------
create table if not exists public.course_enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id text references public.courses(id) on delete cascade not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  last_accessed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_bookmarked boolean default false,
  unique (user_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id text references public.courses(id) on delete cascade not null,
  lesson_id text references public.lessons(id) on delete cascade not null,
  is_completed boolean default false not null,
  completed_at timestamp with time zone,
  quiz_score integer check (quiz_score >= 0 and quiz_score <= 100),
  unique (user_id, lesson_id)
);

-- ------------------------------------------------------------------------------
-- 6. SOVEREIGN BLOCKCHAIN CERTIFICATES & CREDENTIALS
-- ------------------------------------------------------------------------------
create table if not exists public.certificates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id text references public.courses(id) on delete cascade not null,
  course_title text not null,
  issued_date text not null default to_char(now(), 'YYYY-MM-DD'),
  transaction_hash text not null unique,
  credential_id text not null unique,
  nqf_level text default 'Level 8 (Honours / Postgraduate Equivalent)',
  blockchain_network text default 'CogniSacra Sovereign Academic Ledger (Consensus PoA)',
  linkedin_share_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 7. INSTITUTIONAL ACCREDITATION ROSTER & ONBOARDING CODES
-- ------------------------------------------------------------------------------
create table if not exists public.accreditations (
  id text not null primary key,
  code text not null unique,
  target_role text check (target_role in ('learner', 'instructor')) not null,
  member_name text not null,
  member_email text not null,
  institution_id text not null,
  institution_name text not null,
  institution_logo text,
  campus_name text not null,
  department text not null,
  program text not null,
  issued_at date default current_date not null,
  expires_at date not null,
  status text check (status in ('active', 'redeemed', 'revoked')) default 'active' not null,
  redeemed_by uuid references public.profiles(id) on delete set null,
  redeemed_at timestamp with time zone,
  accreditation_hash text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 8. GAMIFICATION: ACHIEVEMENTS & USER AWARDS
-- ------------------------------------------------------------------------------
create table if not exists public.achievements (
  id text not null primary key,
  name text not null,
  description text not null,
  icon text not null default 'award',
  color text default '#10B981',
  xp_reward integer default 100,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_id text references public.achievements(id) on delete cascade not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, achievement_id)
);

-- ------------------------------------------------------------------------------
-- 9. MENTORSHIP & FACULTY OFFICE HOURS
-- ------------------------------------------------------------------------------
create table if not exists public.mentorship_sessions (
  id uuid default uuid_generate_v4() primary key,
  mentor_id uuid references public.profiles(id) on delete cascade not null,
  mentee_id uuid references public.profiles(id) on delete cascade not null,
  scheduled_at timestamp with time zone not null,
  duration_minutes integer default 60 not null,
  topic text not null,
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending' not null,
  meeting_url text,
  advisory_rate numeric(10, 2) default 0.00,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 10. COMMUNITY FEED, POSTS & DISCUSSIONS
-- ------------------------------------------------------------------------------
create table if not exists public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  author_name text not null,
  author_avatar text,
  author_role text default 'scholar',
  content text not null,
  category text default 'General Academic Discussion',
  likes_count integer default 0,
  comments_count integer default 0,
  tags text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.post_comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  author_name text not null,
  author_avatar text,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 11. INDEXES FOR HIGH-THROUGHPUT RETRIEVAL
-- ------------------------------------------------------------------------------
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_learners_username on public.learners_data(username);
create index if not exists idx_courses_category on public.courses(category);
create index if not exists idx_courses_status on public.courses(status);
create index if not exists idx_courses_instructor on public.courses(instructor_id);
create index if not exists idx_courses_institution on public.courses(institution_id);
create index if not exists idx_modules_course on public.modules(course_id);
create index if not exists idx_lessons_course on public.lessons(course_id);
create index if not exists idx_lessons_module on public.lessons(module_id);
create index if not exists idx_enrollments_user on public.course_enrollments(user_id);
create index if not exists idx_enrollments_course on public.course_enrollments(course_id);
create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id);
create index if not exists idx_certificates_user on public.certificates(user_id);
create index if not exists idx_certificates_hash on public.certificates(transaction_hash);
create index if not exists idx_accreditations_code on public.accreditations(upper(code));
create index if not exists idx_mentorship_mentor on public.mentorship_sessions(mentor_id);
create index if not exists idx_mentorship_mentee on public.mentorship_sessions(mentee_id);
create index if not exists idx_community_posts_created on public.community_posts(created_at desc);

-- ------------------------------------------------------------------------------
-- 12. AUTOMATIC TIMESTAMP UPDATE TRIGGER
-- ------------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

do $$
declare
  t text;
begin
  for t in 
    select table_name from information_schema.columns 
    where table_schema = 'public' and column_name = 'updated_at'
  loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute procedure public.handle_updated_at();', t);
  end loop;
end;
$$;

-- ------------------------------------------------------------------------------
-- 13. AUTOMATED USER PROVISIONING TRIGGER (auth.users -> profiles + role tables)
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_role text;
  v_full_name text;
  v_avatar_url text;
begin
  v_role := coalesce(new.raw_user_meta_data->>'role', 'learner');
  v_full_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  v_avatar_url := coalesce(new.raw_user_meta_data->>'avatar_url', 'https://i.pravatar.cc/150?u=' || new.id);

  -- 1. Insert Base Profile
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (new.id, new.email, v_full_name, v_avatar_url, v_role)
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    role = excluded.role;

  -- 2. Insert Default Settings
  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  -- 3. Provision Role-Specific Profile
  if v_role = 'instructor' then
    insert into public.instructors_data (id, display_name, bio)
    values (new.id, v_full_name, 'Academic Lecturer & Course Creator at CogniSacra.')
    on conflict (id) do nothing;
  elsif v_role = 'institution' then
    insert into public.institutions_data (id, name, contact_email)
    values (new.id, v_full_name, new.email)
    on conflict (id) do nothing;
  else
    insert into public.learners_data (id, username, display_name)
    values (new.id, split_part(new.email, '@', 1) || '_' || substr(md5(random()::text), 1, 4), v_full_name)
    on conflict (id) do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS across all tables
alter table public.profiles enable row level security;
alter table public.learners_data enable row level security;
alter table public.instructors_data enable row level security;
alter table public.institutions_data enable row level security;
alter table public.user_settings enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.certificates enable row level security;
alter table public.accreditations enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.mentorship_sessions enable row level security;
alter table public.community_posts enable row level security;
alter table public.post_comments enable row level security;

-- 14.1 Profiles RLS
create policy "Public profiles are viewable by anyone" on public.profiles
  for select using (true);
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- 14.2 Learners Data RLS
create policy "Learners data is viewable by anyone" on public.learners_data
  for select using (true);
create policy "Learners can insert their own data" on public.learners_data
  for insert with check (auth.uid() = id);
create policy "Learners can update their own data" on public.learners_data
  for update using (auth.uid() = id);

-- 14.3 Instructors Data RLS
create policy "Instructors data is viewable by anyone" on public.instructors_data
  for select using (true);
create policy "Instructors can insert their own data" on public.instructors_data
  for insert with check (auth.uid() = id);
create policy "Instructors can update their own data" on public.instructors_data
  for update using (auth.uid() = id);

-- 14.4 Institutions Data RLS
create policy "Institutions data is viewable by anyone" on public.institutions_data
  for select using (true);
create policy "Institutions can insert their own data" on public.institutions_data
  for insert with check (auth.uid() = id);
create policy "Institutions can update their own data" on public.institutions_data
  for update using (auth.uid() = id);

-- 14.5 User Settings RLS
create policy "Users can view their own settings" on public.user_settings
  for select using (auth.uid() = user_id);
create policy "Users can insert their own settings" on public.user_settings
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own settings" on public.user_settings
  for update using (auth.uid() = user_id);

-- 14.6 Courses RLS
create policy "Published courses are viewable by everyone" on public.courses
  for select using (is_draft = false or auth.uid() = instructor_id or auth.uid() = institution_id);
create policy "Instructors and Institutions can create courses" on public.courses
  for insert with check (auth.uid() = instructor_id or auth.uid() = institution_id);
create policy "Course creators can update their own courses" on public.courses
  for update using (auth.uid() = instructor_id or auth.uid() = institution_id);
create policy "Course creators can delete their own courses" on public.courses
  for delete using (auth.uid() = instructor_id or auth.uid() = institution_id);

-- 14.7 Modules & Lessons RLS
create policy "Modules are viewable by anyone" on public.modules
  for select using (true);
create policy "Course creators can manage modules" on public.modules
  for all using (
    exists (
      select 1 from public.courses c 
      where c.id = modules.course_id and (c.instructor_id = auth.uid() or c.institution_id = auth.uid())
    )
  );

create policy "Lessons are viewable by authenticated users" on public.lessons
  for select using (true);
create policy "Course creators can manage lessons" on public.lessons
  for all using (
    exists (
      select 1 from public.courses c 
      where c.id = lessons.course_id and (c.instructor_id = auth.uid() or c.institution_id = auth.uid())
    )
  );

-- 14.8 Course Enrollments RLS
create policy "Users can view their own course enrollments" on public.course_enrollments
  for select using (auth.uid() = user_id);
create policy "Instructors can view enrollments in their courses" on public.course_enrollments
  for select using (
    exists (
      select 1 from public.courses c 
      where c.id = course_enrollments.course_id and (c.instructor_id = auth.uid() or c.institution_id = auth.uid())
    )
  );
create policy "Users can enroll themselves in courses" on public.course_enrollments
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own course progress" on public.course_enrollments
  for update using (auth.uid() = user_id);

-- 14.9 Lesson Progress RLS
create policy "Users can manage their own lesson progress" on public.lesson_progress
  for all using (auth.uid() = user_id);

-- 14.10 Certificates & Credentials RLS
create policy "Certificates are publicly verifiable" on public.certificates
  for select using (true);
create policy "Certificates can be awarded to user" on public.certificates
  for insert with check (auth.uid() = user_id or auth.role() = 'service_role');

-- 14.11 Accreditations RLS
create policy "Accreditation codes can be verified by anyone" on public.accreditations
  for select using (true);
create policy "Institutions can issue accreditation codes" on public.accreditations
  for insert with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'institution'
    )
  );
create policy "Institutions and redeemers can update accreditation status" on public.accreditations
  for update using (
    auth.uid() = redeemed_by or 
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'institution')
  );

-- 14.12 Achievements RLS
create policy "Achievements are viewable by everyone" on public.achievements
  for select using (true);
create policy "User achievements are viewable by everyone" on public.user_achievements
  for select using (true);
create policy "Users can earn achievements" on public.user_achievements
  for insert with check (auth.uid() = user_id);

-- 14.13 Mentorship Sessions RLS
create policy "Mentors and mentees can view their sessions" on public.mentorship_sessions
  for select using (auth.uid() = mentor_id or auth.uid() = mentee_id);
create policy "Users can schedule mentorship sessions" on public.mentorship_sessions
  for insert with check (auth.uid() = mentee_id);
create policy "Participants can update their mentorship sessions" on public.mentorship_sessions
  for update using (auth.uid() = mentor_id or auth.uid() = mentee_id);

-- 14.14 Community Feed RLS
create policy "Community posts are viewable by everyone" on public.community_posts
  for select using (true);
create policy "Authenticated users can create community posts" on public.community_posts
  for insert with check (auth.uid() = author_id);
create policy "Authors can update their own posts" on public.community_posts
  for update using (auth.uid() = author_id);
create policy "Authors can delete their own posts" on public.community_posts
  for delete using (auth.uid() = author_id);

create policy "Comments are viewable by everyone" on public.post_comments
  for select using (true);
create policy "Authenticated users can add comments" on public.post_comments
  for insert with check (auth.uid() = author_id);
create policy "Authors can delete their own comments" on public.post_comments
  for delete using (auth.uid() = author_id);

-- ------------------------------------------------------------------------------
-- 15. ENABLE SUPABASE REALTIME REPLICATION (For live feeds & collaborative chat)
-- ------------------------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.community_posts;
  alter publication supabase_realtime add table public.post_comments;
  alter publication supabase_realtime add table public.course_enrollments;
  alter publication supabase_realtime add table public.mentorship_sessions;
exception
  when duplicate_object then null;
  when undefined_object then null;
end;
$$;
