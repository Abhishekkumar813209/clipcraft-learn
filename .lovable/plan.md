

## Plan: Add Scrollable Video Section — Fortuner with Red Light

### What
Make the UPSC Motivation page scrollable. The current 3D section stays as the **first full-screen section**. Below it, add a **second full-screen section** with a looping background video of a Fortuner with red beacon light (VIP convoy style), overlaid with motivational text about what IAS life represents — Power, Respect, Authority.

### Approach

**File: `src/pages/UpscMotivation.tsx`**

1. **Make page scrollable**: Change the outer container from `h-full overflow-hidden` to `min-h-screen overflow-y-auto` with snap scrolling (`snap-y snap-mandatory`)

2. **Section 1 (existing)**: Wrap current 3D + overlay content in a `h-screen snap-start` div — no changes to content

3. **Section 2 (new — Fortuner Video Section)**:
   - Full-screen `h-screen snap-start` section with a `<video>` background
   - Video: Use a royalty-free dark Fortuner/SUV convoy video from a public CDN or embed a YouTube video as background. Since we can't host videos, we'll use a **YouTube embed** (muted, autoplay, loop) of a VIP convoy Fortuner video as an iframe background
   - Dark overlay on top of video (`bg-black/60`)
   - Content overlay with 4 bold text cards in a grid:
     - 🔴 **Power** — "Tera ek order, system hilega"
     - 💰 **Respect** — "Salute milega har jagah"
     - 🏛️ **Authority** — "District tera hoga"
     - 🇮🇳 **Impact** — "Crores ki zindagi badlegi"
   - Each card: glassmorphism style (`bg-white/10 backdrop-blur-md border border-white/20`)
   - Bottom text: "Ye sab tera hoga — bas padh le" with a scroll-up arrow

4. **Scroll indicator**: Add a subtle bouncing down-arrow at bottom of Section 1 to hint "scroll down"

### Video Strategy
Since we can't host video files, we'll use a YouTube embed as background iframe (muted, autoplay, loop, no controls). I'll pick a generic VIP convoy / red light Fortuner video ID. Alternatively, we can use a CSS-animated gradient with red flashing light effect as fallback if iframe doesn't look clean.

**Better approach**: Use a pure CSS animated background — dark road scene with a pulsing red beacon light effect (CSS radial gradient animation). This avoids external dependencies and copyright issues entirely, keeps it lightweight.

### CSS Animation for Red Beacon
- Pulsing red radial gradient at the top of section 2
- Dark gradient background simulating night road
- Red glow animation cycling every 1.5s

### Files to edit
- `src/pages/UpscMotivation.tsx` — restructure to scrollable sections, add Section 2

