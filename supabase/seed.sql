-- ==============================================================================
-- COGNISACRA SOVEREIGN ACADEMY & INSTITUTIONAL NETWORK
-- Production Seed Data for Supabase
-- ==============================================================================
-- Run this script in the Supabase SQL Editor after running schema.sql.
-- Populates:
--  1. Default gamification achievements & badges
--  2. Initial catalog of accredited courses, modules, and lessons
--  3. Pre-authorized Institutional Accreditation codes for on-boarding testing
-- ==============================================================================

-- 1. ACHIEVEMENTS & GAMIFICATION
insert into public.achievements (id, name, description, icon, color, xp_reward) values
  ('ach-first-step', 'First Steps', 'Completed your first sovereign curriculum lesson.', 'book-open', '#10B981', 100),
  ('ach-curious-mind', 'Curious Mind', 'Engaged with the CogniSacra AI Research Desk & Tutor.', 'sparkles', '#06B6D4', 150),
  ('ach-course-conqueror', 'Course Conqueror', 'Finished your first accredited course track with 100% completion.', 'trophy', '#F59E0B', 500),
  ('ach-ledger-scholar', 'Ledger Scholar', 'Minted your first verifiable on-chain sovereign diploma.', 'award', '#8B5CF6', 1000),
  ('ach-pythonista', 'Distributed Systems Expert', 'Completed the Distributed Systems & Ledger Protocols course.', 'terminal', '#3B82F6', 400),
  ('ach-neural-fellow', 'Neural Engineering Fellow', 'Completed the AI Neural Architectures and Microgrid simulation modules.', 'brain', '#EC4899', 450),
  ('ach-mentor-guide', 'Faculty Advisor', 'Hosted or attended your first faculty office hours consultation.', 'users', '#10B981', 300)
on conflict (id) do nothing;

-- 2. ACCREDITED COURSES
insert into public.courses (
  id, title, category, description, instructor_name, instructor_image, image_url, 
  level, price, price_type, duration, university, university_logo, 
  learning_outcomes, status, status_label, is_draft, offered_by, qualification_type, rating, reviews_count
) values
(
  'react-mastery',
  'Advanced React & Sovereign State Architecture',
  'Software Engineering',
  'Master high-performance React architectures, offline-first local cache synchronization, and secure front-end state graphs under sovereign privacy models.',
  'Prof. Alex Turner',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  'Intermediate',
  0.00,
  'free',
  '12 hours',
  'CogniSacra Sovereign Academy',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&q=80',
  array['Implement offline-first client replication', 'Master fine-grained reactive state engines', 'Deploy zero-latency UI pipelines'],
  'active',
  'Self-Paced',
  false,
  'instructor',
  'Accredited Micro-Credential',
  4.92,
  218
),
(
  'dist-systems-101',
  'Autonomous Ledger Consensus & Distributed Systems',
  'Computer Science',
  'Exhaustive theoretical and practical exploration of Byzantine fault tolerance, vector clocks, async network topologies, and sovereign compute grids.',
  'Dr. Sarah Mwangi',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  'Advanced',
  120.00,
  'one-time',
  '24 hours',
  'University of Oxford - St. Antonys Fellowship',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&q=80',
  array['Formulate BFT consensus proofs', 'Optimize peer-to-peer gossip algorithms', 'Audit smart protocol safety invariants'],
  'active',
  'Online',
  false,
  'institution',
  'Postgraduate Diploma Track',
  4.98,
  340
),
(
  'neural-ai-systems',
  'Frontier Neural Architectures & Cognitive AI',
  'Artificial Intelligence',
  'Dive into state-space neural models, multi-agent cooperative games, transformers, and edge-native model compression across decentralized hardware.',
  'Prof. Isabella Al-Fara',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80',
  'https://images.unsplash.com/photo-1507842229450-7990e3488c73?w=800&q=80',
  'Advanced',
  150.00,
  'one-time',
  '18 hours',
  'MIT CSAIL Sovereign Ethics Initiative',
  'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&q=80',
  array['Train localized cognitive agents', 'Formulate neuro-symbolic reasoning models', 'Conduct real-time STEM sandbox simulations'],
  'active',
  'Self-Paced',
  false,
  'institution',
  'Executive Certificate',
  4.88,
  185
)
on conflict (id) do nothing;

-- 3. MODULES FOR REACT MASTERY COURSE
insert into public.modules (id, course_id, title, order_index) values
  ('mod-1', 'react-mastery', 'Module 1: Foundations of Sovereign Architecture', 1),
  ('mod-2', 'react-mastery', 'Module 2: Concurrency & Asynchronous Cache Invariants', 2),
  ('mod-3', 'react-mastery', 'Module 3: Production Hardening & Capstone Protocol', 3)
on conflict (id) do nothing;

-- 4. LESSONS FOR MODULE 1
insert into public.lessons (
  id, module_id, course_id, title, duration, format, order_index, description, content
) values
(
  'les-1-1',
  'mod-1',
  'react-mastery',
  'Deconstructing Modern Single Page Architecture',
  '18 mins',
  'video',
  1,
  'An architectural deep dive into client-side routing, virtual reconciliation, and micro-frontend boundaries.',
  'Comprehensive exploration of deterministic state transitions and reactive pipelines.'
),
(
  'les-1-2',
  'mod-1',
  'react-mastery',
  'Offline-First Local Storage & IndexedDB Synchronization',
  '25 mins',
  'reading',
  2,
  'Learn how sovereign academic platforms preserve data integrity across network drops and edge nodes.',
  'Detailed study of transactional queues, optimistic writes, and CRDT replication.'
),
(
  'les-1-3',
  'mod-1',
  'react-mastery',
  'Knowledge Check: Reactive Invariants Quiz',
  '15 mins',
  'quiz',
  3,
  'Verifiable competency examination on concurrency, immutable trees, and edge caching.',
  'Automated adaptive grading evaluating architectural decision matrices.'
)
on conflict (id) do nothing;

-- 5. PRE-POPULATED ACCREDITATION ROSTER (For testing Code Verification & Redemption flow)
insert into public.accreditations (
  id, code, target_role, member_name, member_email, institution_id, 
  institution_name, institution_logo, campus_name, department, program, 
  issued_at, expires_at, status, accreditation_hash
) values
(
  'acc-1',
  'COG-STU-2026-9F4B',
  'learner',
  'Kofi Mensah',
  'k.mensah@cognisacra.edu',
  'inst-cognisacra',
  'CogniSacra Sovereign University',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&q=80',
  'Main Campus (Nairobi)',
  'School of AI & Neural Computing',
  'B.Sc Sustainable Microgrids & AI',
  '2026-06-15',
  '2027-06-15',
  'active',
  '0x8F9B2C4D7A1E3B8C9F1A4D7C2B5E8A1F'
),
(
  'acc-2',
  'COG-LEC-2026-7A1C',
  'instructor',
  'Dr. Sarah Mwangi',
  's.mwangi@cognisacra.edu',
  'inst-cognisacra',
  'CogniSacra Sovereign University',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&q=80',
  'Main Campus (Nairobi)',
  'Department of Decentralized Agronomy',
  'Senior Lecturer & AI Curriculum Lead',
  '2026-06-10',
  '2028-06-10',
  'active',
  '0x4D1A9F7C3B8E1A4D7C2B5E8A1F9B2C4D'
),
(
  'acc-3',
  'OXF-AI-2026-4412',
  'learner',
  'Amara Okafor',
  'amara.okafor@oxford.edu',
  'inst-oxford',
  'Oxford Institute of Advanced Intelligence',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&q=80',
  'Europe Satellite (UK)',
  'Cognitive Computing & Robotics',
  'M.Sc Neural Architectures',
  '2026-06-01',
  '2027-06-01',
  'active',
  '0x7C3B8E4D9F1A1A4D7C2B5E8A1F9B2C4D'
),
(
  'acc-4',
  'MIT-FAC-2026-1092',
  'instructor',
  'Prof. David Nkosi',
  'd.nkosi@mit.edu',
  'inst-mit',
  'MIT Decentralized Computing Node',
  'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&q=80',
  'Cape Town Research Station',
  'Distributed Systems & Ledger Protocols',
  'Lead Research Fellow',
  '2026-05-20',
  '2028-05-20',
  'active',
  '0x1A9F7C3B8E4D1A4D7C2B5E8A1F9B2C4D'
)
on conflict (id) do nothing;
