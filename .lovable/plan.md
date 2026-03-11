

# Add Breadcrumb Navigation + URL Routing for TopicView

## Problem
The `/topic` route relies on Zustand store IDs (`selectedTopicId`, `selectedSubjectId`) which are lost on refresh. The breadcrumb text is static and not clickable.

## Solution

### 1. URL-based topic routing
Change the route from `/topic` to `/topic/:topicId` so the topic ID is in the URL and survives refresh.

**`src/App.tsx`** — Change route to `<Route path="topic/:topicId" element={<TopicView />} />`

**`src/components/TopicView.tsx`**:
- Use `useParams()` to get `topicId` from URL instead of `selectedTopicId` from store
- Look up topic, subject, and exam by iterating through `exams` data using the URL param
- On mount, sync store selection state from the URL param (so other components stay consistent)

**All navigation to topic page** — Update any `navigate('/topic')` calls to `navigate(\`/topic/${topicId}\`)` across components (DashboardView, AddClipsView, etc.)

### 2. Clickable breadcrumbs
Replace the static `<p>` breadcrumb with interactive links using the existing Breadcrumb UI components:

```
📘 Placement  /  DSA  /  Depesh Malviya
   [link→/]      [link→/]   [current page]
```

- **Exam name** click → `setSelectedExam(exam.id)` + `navigate('/')`
- **Subject name** click → `setSelectedExam(exam.id)` + `setSelectedSubject(subject.id)` + `navigate('/')`
- **Topic name** → bold, non-clickable (current page)

Uses existing `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbSeparator` components from `src/components/ui/breadcrumb.tsx`.

### Files to change

| File | Change |
|------|--------|
| `src/App.tsx` | Route: `/topic/:topicId` |
| `src/components/TopicView.tsx` | `useParams` for topicId, clickable breadcrumbs |
| `src/components/DashboardView.tsx` | Update navigate calls to include topicId |
| `src/components/AddClipsView.tsx` | Update any navigate to topic |
| Any other files navigating to `/topic` | Include topicId in URL |

