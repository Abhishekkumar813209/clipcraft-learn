

## Plan: Enhance Humor Coach with Home Button + 50 Template Conversations

### Changes

**1. Add Home button in header (`src/pages/HumorCoach.tsx`)**
- Add a "← Home" button next to the title that navigates back to `/`

**2. Add 50 pre-built Indian/Hinglish template conversations**
- Create a scrollable grid of template cards below the textarea
- Each card shows a short title + category badge (e.g., "Office", "Family", "Cricket", "College", "Rickshaw", "Shaadi", "Desi Parents", "IPL", "Flatmates", "Train Journey")
- Clicking a template auto-fills the textarea with that conversation
- Templates are realistic Hinglish conversations covering situations like:
  - Desi parents vs career choices
  - IPL match watch party arguments
  - Bargaining with auto/rickshaw wala
  - Office Zoom call disasters
  - College group project WhatsApp chats
  - Shaadi function relatives interrogation
  - Flatmate food theft confrontation
  - Indian railway journey encounters
  - Sharma ji ka beta comparisons
  - Festival planning chaos
  - And 40 more similar Indian context scenarios

**3. UI layout**
- Templates section appears between the input area and response area
- Collapsible section with "Browse Templates (50)" header
- 2-column grid on mobile, 3-column on desktop
- Each card: title, category badge, first line preview
- Click → fills textarea, scrolls to top, ready to analyze

### Files Modified
- `src/pages/HumorCoach.tsx` — add home button + templates section with 50 conversations

