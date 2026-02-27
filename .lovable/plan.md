

# Why "No Exams Yet" and What Needs to Change

## Root Cause

The app stores ALL data (exams, subjects, clips, etc.) in **browser localStorage** via Zustand's `persist` middleware. There is **no database** — no tables exist in the backend. So:

- Data only exists in that specific browser on that specific device
- Clearing browser data or opening in a new tab/incognito = empty state
- No authentication exists, so there's no user identity to tie data to

## What Needs to Be Done

### 1. Create Database Tables
Create tables for: `exams`, `subjects`, `topics`, `sub_topics`, `clips`, `videos`, `youtube_sources` — all linked to a `user_id` column.

### 2. Add Authentication
Add signup/login so each user's data is tied to their account. Without auth, RLS policies can't work and data can't be user-scoped.

### 3. Sync Store with Database
Replace the localStorage-only Zustand store with one that reads/writes to the database. Keep Zustand for UI state but fetch/mutate via the backend.

### 4. Test Add Clips Feature
Once data persistence works, verify the full flow: create exam → add subject → add topic → add sub-topic → add clip from playlist.

---

## Technical Plan

### Database Schema (Migration)

```sql
-- Users profile (for future use)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📚',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  "order" INT DEFAULT 0
);

CREATE TABLE public.sub_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  "order" INT DEFAULT 0
);

CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  youtube_id TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INT DEFAULT 0,
  channel_name TEXT,
  source_id UUID,
  playlist_position INT
);

CREATE TABLE public.clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  sub_topic_id UUID NOT NULL REFERENCES public.sub_topics(id) ON DELETE CASCADE,
  start_time INT NOT NULL,
  end_time INT NOT NULL,
  label TEXT,
  notes TEXT,
  is_primary BOOLEAN DEFAULT true,
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.youtube_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('playlist', 'channel')),
  youtube_id TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  video_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies (all tables: user can only access own data)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_sources ENABLE ROW LEVEL SECURITY;

-- Each table gets SELECT/INSERT/UPDATE/DELETE for authenticated user matching user_id
```

### Authentication
- Create `src/pages/Auth.tsx` with login/signup form
- Add auth context/provider
- Protect routes — redirect to login if not authenticated
- Auto-create profile on signup via trigger

### Refactor `studyStore.ts`
- Replace localStorage persist with database CRUD operations
- Each `addExam`, `addSubject`, etc. will call `supabase.from('exams').insert(...)` 
- On app load, fetch all user data from DB
- Keep Zustand for reactive UI state, but source of truth = database

### Files to Create/Modify

| File | Action |
|------|--------|
| Database migration | Create all 8 tables + RLS policies |
| `src/pages/Auth.tsx` | New — login/signup page |
| `src/contexts/AuthContext.tsx` | New — auth state management |
| `src/stores/studyStore.ts` | Refactor — DB-backed instead of localStorage |
| `src/pages/Index.tsx` | Add auth guard |
| `src/App.tsx` | Add auth route |

This is a significant refactor since the entire data layer moves from localStorage to a proper database with authentication.

