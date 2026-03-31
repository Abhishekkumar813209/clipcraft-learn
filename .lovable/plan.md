

## Plan: Save PDF Quizzes to Database with Folders for Revision

### What It Does
After a quiz is generated, a "Save Quiz" button lets you name it and pick/create a folder. Saved quizzes are stored in the database and accessible from a new "My Quizzes" section for quick revision.

### Database Changes

**New table: `pdf_quiz_folders`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | RLS-linked |
| name | text | e.g. "Polity", "Economics" |
| created_at | timestamptz | default now() |

**New table: `pdf_saved_quizzes`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | RLS-linked |
| folder_id | uuid | FK to pdf_quiz_folders, nullable (unfiled) |
| name | text | Custom quiz name |
| pdf_name | text | Source PDF file name |
| page_range | text | e.g. "5-8" or "3" |
| questions | jsonb | Full quiz data (questions, options, answers) |
| language | text | hindi/english/hinglish |
| created_at | timestamptz | default now() |

RLS: Users can CRUD own rows on both tables.

### UI Changes

**1. PdfQuizPanel — "Save Quiz" button**
- Appears in the quiz header (next to close button) after questions are generated
- Opens a small dialog with:
  - Quiz name input (pre-filled: `"{pdfName} - Page {range}"`)
  - Folder dropdown (existing folders + "New Folder" option)
- Saves to `pdf_saved_quizzes` via Supabase client

**2. PdfReaderView — Pass `fileName` to PdfQuizPanel**
- Add `fileName` prop to PdfQuizPanel

**3. New component: `SavedQuizzesView.tsx`**
- Accessible from main navigation/sidebar
- Shows folders as expandable cards
- Each quiz shows: name, PDF source, page range, date, question count
- Click to open quiz in revision mode (re-renders PdfQuizPanel with saved data)
- Delete and rename options

**4. Sidebar — Add "My Quizzes" nav link**

### Files Modified

| File | Change |
|------|--------|
| Migration SQL | Create `pdf_quiz_folders` and `pdf_saved_quizzes` tables with RLS |
| `src/components/PdfQuizPanel.tsx` | Add `fileName` prop, "Save Quiz" button with name/folder dialog |
| `src/components/PdfReaderView.tsx` | Pass `fileName` and `pageRange` to PdfQuizPanel |
| `src/components/SavedQuizzesView.tsx` | New — browse folders, view/revise saved quizzes |
| `src/components/Sidebar.tsx` | Add "My Quizzes" navigation link |
| `src/App.tsx` | Add route for saved quizzes page |

