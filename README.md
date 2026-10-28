
# CogniSacra Academy

**AI-Powered Educational Platform**

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?logo=supabase)](https://supabase.com/)
[![Google AI](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)

</div>

---

## Overview

CogniSacra Academy is a comprehensive AI-powered educational platform serving three user roles: **Learners**, **Instructors**, and **Institutions**. Built with React 19, TypeScript, and integrated with Google Gemini AI for personalized learning experiences.

---

## Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Frontend       | React 19, TypeScript, Tailwind CSS |
| Build          | Vite 6.2                           |
| Database       | Supabase (PostgreSQL)              |
| Authentication | Supabase Auth (Email, OAuth)       |
| AI/ML          | Google Gemini 3 Flash, Imagen 4.0  |
| Animation      | Motion (Framer Motion)             |
| Icons          | Lucide React                       |
| i18n           | i18next, react-i18next             |

---

## Run Locally

**Prerequisites:** Node.js 18+, pnpm

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env with your keys

# 3. Run development server
pnpm dev
```

---

## Environment Variables

```env
# Required
GEMINI_API_KEY=your_gemini_api_key

# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## MVP Checklist

> **MVP Implementation Status:** The foundational Supabase schema (core profile tables + all Phase 2–6 MVP tables) is implemented in `supabase/schema.sql` and seeded via `supabase/seed.sql`. OAuth provider configuration is intentionally left untouched.

### Phase 1: Foundation & Authentication

#### Database Setup (Supabase)

- [ ] Create Supabase project
- [ ] Configure Authentication providers
  - [ ] Email/Password
  - [ ] Google OAuth
  - [ ] Apple OAuth (optional)
- [x] Set up Row Level Security (RLS) policies
- [ ] Create database tables:

```sql
-- Core Tables
- [x] profiles (id, email, display_name, avatar_url, role, created_at)
- [x] learners_data (id, user_id, interests[], learning_goals[], streak_count, xp_points)
- [x] instructors_data (id, user_id, bio, credentials, verified, payout_method)
- [x] institutions_data (id, user_id, name, logo_url, domain, verified)

-- Course Management
- [x] courses (id, title, description, instructor_id, institution_id, price, status, created_at)
- [x] modules (id, course_id, title, order_index)
- [x] lessons (id, module_id, title, format, content, duration, order_index)
- [x] enrollments (id, user_id, course_id, progress, enrolled_at, completed_at)
- [x] lesson_progress (id, user_id, lesson_id, completed, completed_at)

-- Assessment
- [x] quizzes (id, lesson_id, title, questions_json, passing_score)
- [x] quiz_attempts (id, user_id, quiz_id, score, answers_json, attempted_at)
- [x] projects (id, lesson_id, title, brief, rubric_json)
- [x] project_submissions (id, user_id, project_id, content, grade, submitted_at)

-- Social & Gamification
- [x] achievements (id, name, description, icon, xp_reward)
- [x] user_achievements (id, user_id, achievement_id, earned_at)
- [x] certificates (id, user_id, course_id, issued_at, blockchain_hash)
- [x] community_posts (id, user_id, course_id, content, created_at)
- [x] post_comments (id, post_id, user_id, content, created_at)

-- Calendar & Scheduling
- [x] events (id, user_id, title, type, start_time, end_time)
- [x] mentorship_sessions (id, mentor_id, learner_id, scheduled_at, status)
```

#### Authentication Flow

- [x] Splash screen animation
- [x] Login view (email/password + OAuth)
- [x] Sign up flow
- [x] Role selection (learner/instructor/institution)
- [x] Personalization quiz (learner interests)
- [x] Welcome/onboarding guide
- [x] Session persistence (remember me)
- [x] Password reset flow
- [x] Email verification

---

### Phase 2: Core Learning Experience (Learner)

#### Dashboard

- [ ] Personalized course recommendations
- [ ] Continue learning section
- [ ] Progress overview widget
- [ ] AI Quick Answer widget (Gemini integration)
- [ ] Trending courses carousel
- [ ] Upcoming deadlines

#### Course Discovery

- [ ] Course catalog with filters (category, level, price, rating)
- [ ] Search functionality
- [ ] Course landing page
  - [ ] Video trailer
  - [ ] Learning outcomes
  - [ ] Curriculum preview
  - [ ] Instructor info
  - [ ] Reviews & ratings
  - [ ] Enrollment CTA

#### Learning Experience

- [ ] Lesson viewer
  - [ ] Video player with controls
  - [ ] Transcript panel
  - [ ] Resources/downloads
  - [ ] Discussion thread
  - [ ] Progress tracking
- [ ] Quiz system
  - [ ] Multiple choice questions
  - [ ] Adaptive difficulty (Gemini)
  - [ ] Instant feedback
  - [ ] Review suggestions
- [ ] Project submission
  - [ ] File/text upload
  - [ ] Peer review (optional)
  - [ ] Instructor grading

#### AI Tutor

- [ ] Chat interface with Gemini
- [ ] Personality modes (Academic/Mentor/Coach)
- [ ] Conversation history
- [ ] Voice input (speech recognition)
- [ ] Text-to-speech output
- [ ] Context-aware responses

---

### Phase 3: Instructor Tools

#### Instructor Dashboard

- [ ] Course management overview
- [ ] Student analytics summary
- [ ] Revenue tracking
- [ ] Recent activity feed

#### Course Builder

- [ ] Course creation wizard
- [ ] Module & lesson editor
- [ ] Content types:
  - [ ] Video upload/embed
  - [ ] Rich text editor
  - [ ] Quiz builder
  - [ ] Project assignment
- [ ] Pricing & discounts
- [ ] Publish workflow

#### Analytics

- [ ] Enrollment statistics
- [ ] Completion rates
- [ ] Student engagement metrics
- [ ] Revenue reports
- [ ] Dropout analysis

#### AI Architect

- [ ] Course design assistant
- [ ] Curriculum suggestions
- [ ] Content optimization tips

---

### Phase 4: Institution Portal

#### Institution Dashboard

- [ ] Learner management
- [ ] Course catalog management
- [ ] Analytics by department/region
- [ ] Revenue tracking

#### White-Label Features

- [ ] Custom branding (logo, colors)
- [ ] Custom domain support
- [ ] Program/bundle creation

#### Staff Management

- [ ] Admin roles
- [ ] Instructor verification
- [ ] Billing management

---

### Phase 5: Social & Gamification

#### Gamification

- [ ] XP & leveling system
- [ ] Achievement badges
- [ ] Streak tracking
- [ ] Leaderboards
- [ ] Certificates with blockchain verification

#### Community

- [ ] Course discussion forums
- [ ] Community hub
- [ ] Mentorship matching
- [ ] Job board integration

---

### Phase 6: Advanced Features

#### Virtual Classroom (Live)

- [ ] Live session scheduling
- [ ] Video conferencing integration
- [ ] Chat & Q&A
- [ ] Attendance tracking
- [ ] Recording & playback

#### Virtual Library

- [ ] AI reading mode
- [ ] Smart workspace
- [ ] Research tools
- [ ] Knowledge graph

#### AI Tools

- [ ] Image generation (Imagen)
- [ ] Image editing
- [ ] Content summarization
- [ ] Translation (5+ languages)

#### Accessibility

- [ ] Dark mode
- [ ] High contrast mode
- [ ] Dyslexia-friendly fonts
- [ ] Screen reader support
- [ ] Keyboard navigation
- [ ] Text-to-speech

---

### Phase 7: Monetization & Payments

- [ ] Stripe integration
- [ ] Subscription tiers (Free/Pro/Enterprise)
- [ ] One-time course purchases
- [ ] Instructor payout system
- [ ] Coupons & discounts
- [ ] Invoice generation

---

### Phase 8: Deployment & DevOps

- [ ] Vercel deployment configuration
- [ ] Environment variables setup
- [ ] Supabase production project
- [ ] Domain configuration
- [ ] SSL certificates
- [ ] CI/CD pipeline
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Vercel Analytics / GA4)

---

### Phase 9: RBAC & Security (Missing)

#### Role-Based Access Control

- [ ] Admin/superuser role
- [ ] Permission-based access system
  - [ ] `create_course` permission
  - [ ] `manage_users` permission
  - [ ] `view_analytics` permission
  - [ ] `manage_billing` permission
- [ ] Role hierarchy (admin > instructor > learner)
- [ ] Institution staff roles
  - [ ] `institution_admin`
  - [ ] `billing_manager`
  - [ ] `content_manager`
- [ ] Course-level permissions
  - [ ] Owner (full control)
  - [ ] Editor (can edit content)
  - [ ] Viewer (read-only)

#### Database Tables (RBAC)

```sql
-- Permissions & Roles
- [ ] permissions (id, name, description)
- [ ] roles (id, name, permissions[])
- [ ] user_roles (user_id, role_id, scope, scope_id)
- [ ] institution_staff (institution_id, user_id, role, invited_at)

-- Course Access Control
- [ ] course_collaborators (course_id, user_id, permission_level)
```

#### RLS Policies (Missing)

- [ ] Courses RLS (owner/collaborator can edit, public can view published)
- [ ] Enrollments RLS (users can only see own enrollments)
- [ ] Quiz attempts RLS (users can only see own attempts)
- [ ] Project submissions RLS (owner + instructor can view)
- [ ] Certificates RLS (owner can view, public can verify)
- [ ] Institution staff RLS (only institution admins can manage)

#### Security Hardening

- [ ] Rate limiting on API endpoints
- [ ] Input validation & sanitization
- [ ] CSRF protection
- [ ] Content Security Policy (CSP)
- [ ] Audit logging for sensitive actions

---

### Phase 10: Testing & Quality (Missing)

#### Unit Testing

- [ ] Jest/Vitest setup
- [ ] Component tests (React Testing Library)
- [ ] Service tests (Supabase, Gemini)
- [ ] Hook tests

#### Integration Testing

- [ ] Authentication flow tests
- [ ] Course enrollment flow tests
- [ ] Quiz submission flow tests
- [ ] Payment flow tests

#### E2E Testing

- [ ] Playwright/Cypress setup
- [ ] Critical user journeys
- [ ] Cross-browser testing
- [ ] Mobile responsiveness tests

#### Code Quality

- [ ] ESLint configuration
- [ ] Prettier formatting
- [ ] Husky pre-commit hooks
- [ ] TypeScript strict mode
- [ ] Code coverage reports (>80%)

---

### Phase 11: Performance & Optimization (Missing)

#### Frontend Performance

- [ ] Code splitting & lazy loading
- [ ] Image optimization (WebP, lazy load)
- [ ] Bundle size optimization
- [ ] Service Worker & PWA support
- [ ] Preloading critical resources

#### Database Performance

- [ ] Database indexes for common queries
- [ ] Query optimization
- [ ] Connection pooling
- [ ] Caching strategy (Redis/Edge)

#### Monitoring

- [ ] Core Web Vitals tracking
- [ ] Real User Monitoring (RUM)
- [ ] Database query performance
- [ ] API response times

---

### Phase 12: Internationalization (Missing)

#### Multi-language Support

- [ ] Complete i18n setup with i18next
- [ ] Language files for:
  - [ ] English (en)
  - [ ] Spanish (es)
  - [ ] French (fr)
  - [ ] Vietnamese (vi)
  - [ ] Chinese (zh)
  - [ ] Swahili (sw)
- [ ] RTL support for Arabic
- [ ] Date/time/number formatting per locale
- [ ] AI-powered translation fallback

---

### Phase 13: UI/UX Polish & Mobile (Missing)

#### Mobile-First Responsive Design

- [ ] Responsive breakpoints audit (sm, md, lg, xl, 2xl)
- [ ] Mobile navigation (hamburger menu, bottom nav)
- [ ] Touch-friendly UI elements (48px min tap targets)
- [ ] Swipe gestures for mobile interactions
- [ ] Mobile-optimized forms & inputs
- [ ] Responsive tables (horizontal scroll / card view)
- [ ] Mobile video player controls

#### Component Polish

- [ ] Consistent spacing system (4px grid)
- [ ] Typography scale refinement
- [ ] Color contrast accessibility (WCAG AA)
- [ ] Loading states & skeleton screens
- [ ] Empty states design
- [ ] Error states & feedback
- [ ] Micro-interactions & hover effects

#### Mobile-Specific Features

- [ ] Pull-to-refresh
- [ ] Infinite scroll optimization
- [ ] Offline mode indicators
- [ ] App install prompt (PWA)
- [ ] Mobile-specific touch feedback
- [ ] Viewport height fixes (100dvh)

#### Design System

- [ ] Component library documentation
- [ ] Design tokens (colors, spacing, typography)
- [ ] Storybook setup for component preview
- [ ] Figma/design file sync

#### Cross-Device Testing

- [ ] iOS Safari compatibility
- [ ] Android Chrome compatibility
- [ ] Tablet layout optimization
- [ ] Landscape orientation support
- [ ] Notch/safe-area handling

---

## User Roles

| Role                  | Features                                                              |
| --------------------- | --------------------------------------------------------------------- |
| **Learner**     | Browse courses, enroll, learn, earn certificates, AI tutor, community |
| **Instructor**  | Create courses, analytics, AI architect, payout management            |
| **Institution** | White-label portal, learner management, bulk enrollment, analytics    |

---

## API Integrations

### Google Gemini AI

- Tutor chat (streaming)
- Course architect assistant
- Adaptive quiz generation
- Image generation (Imagen 4.0)
- Image editing
- Translation
- Grounded search

### Supabase

- Authentication (Email, OAuth)
- PostgreSQL database
- Row Level Security
- Real-time subscriptions
- Storage (files, images)

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with AI for the future of education**

[Documentation](docs/) · [Report Bug](issues/) · [Request Feature](issues/)

</div>
