# ClipWise Studies

Build a powerful, long-term study web application for serious exam aspirants who want to revise using intelligently compiled lecture clips instead of handwritten notes.

====================================
CORE PHILOSOPHY (NON-NEGOTIABLE)
====================================
The system must be CLIP-FIRST and CONCEPT-DRIVEN.

Do NOT rely on:
- Playlist lecture numbers
- Day-wise order
- Source order

A CLIP is the fundamental unit, defined strictly as:
YouTube Video ID + Start Time + End Time

Playlist lecture numbers and dates are display-only metadata.

====================================
1. EXAM / SUBJECT / TOPIC / SUB-TOPIC
====================================
- Users can create multiple Exams (e.g. UPSC, SSC, IAT, NEET).
- Each Exam contains Subjects.
- Each Subject contains Topics.
- Each Topic contains multiple Sub-Topics (concept-level breakdown).
- The same clip can be reused across multiple Exams, Topics, or Sub-Topics.

====================================
2. SAVED SOURCE LIBRARY (NO REPEATED URLs)
====================================
- Users can save YouTube Playlists or Channels once.
- Saved sources persist permanently unless deleted.
- Sources appear in a reusable library (dropdown-based selection).
- Users should NOT need to paste the same playlist URL repeatedly.
- Playlist lecture numbers are optional display metadata only.

====================================
3. VIDEO & CLIP INTAKE (CRITICAL)
====================================
- User can select:
  - Any video from a saved playlist
  - OR paste a standalone YouTube video URL
- A SINGLE video must support MULTIPLE independent timelines.

For each video:
- User can create unlimited clips (start–end ranges).
- Each clip can be assigned to:
  Exam → Subject → Topic → Sub-Topic
- Clips can come from:
  - Different teachers
  - Different playlists
  - Different days
- Support long marathon videos (hour-level timestamps).
- Optional short label or note per clip.

====================================
4. TIMELINES AS FIRST-CLASS ENTITIES (CRUD)
====================================
Each clip/timeline must support FULL CRUD operations:

CREATE:
- Add multiple timelines from the same video.

READ:
- View all timelines for a video.
- View timelines grouped under Topics / Sub-Topics.

UPDATE:
- Edit start time / end time.
- Reassign Exam / Subject / Topic / Sub-Topic.
- Change order.
- Mark as Primary or Supplementary.

DELETE:
- Delete individual timelines ONLY.
- Deleting a clip must NOT affect the source video or playlist.

====================================
5. CONCEPT-ANCHOR SERIALISATION (MOST IMPORTANT)
====================================
Final video serialization MUST be concept-driven.

Serialization Rules:
1. First order by Sub-Topic sequence (user-defined).
2. Then order clips inside each Sub-Topic.

Inside a Sub-Topic:
- User can manually reorder clips (drag & drop).
- User can mark:
  ⭐ Primary explanation
  ➕ Supplementary explanation

STRICT RULES:
- Day added must NEVER control order.
- Playlist lecture numbers must NEVER control order.

====================================
6. DAILY STUDY WORKFLOW (USER EXPERIENCE)
====================================
- Designed for daily lecture watching:
  “Add clips now, compile later”
- Fast tagging with dropdowns.
- Clean, distraction-free interface.
- Topic view must show:
  - Sub-Topics
  - Clips grouped concept-wise
  - Teacher name, video title, time range

====================================
7. FINAL COMPILATION & EXPORT
====================================
- User can compile:
  - A single Sub-Topic
  - A full Topic
  - A complete Subject
- Before export:
  - Show final clip order
  - Show total duration
- Export options:
  - Download one merged video
  - Save as editable revision project

====================================
8. TECH EXPECTATIONS
====================================
- Frontend: React / Next.js with timeline-based UI
- Backend: FFmpeg-based cutting & stitching
- Store clip metadata first; fetch videos only during compilation
- Handle long playlists and marathon videos efficiently
- Robust error handling for unavailable/private videos

====================================
9. ABSOLUTE RULES
====================================
- Clip identity = Video ID + timestamps.
- Playlists are only sources, never logic drivers.
- Multiple teachers and playlists must freely combine.
- Serialization must always follow concept flow.

====================================
10. PRODUCT VISION
====================================
Design this as a long-term personal revision engine for students who:
- Watch lectures daily
- Do not have time to write notes
- Want to build a high-quality revision asset over months
- Revise using the best explanations from multiple teachers

The product should feel like a personal study brain, not a simple video editor.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://clipcraft-learn.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a2bed118-68db-4d7d-b9e7-9caf61b49755).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
