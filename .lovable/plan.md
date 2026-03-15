

## Plan: UPSC Motivation 3D Page

### What
A new `/upsc` route with a lightweight 3D motivational page using `@react-three/fiber` + `@react-three/drei`. It'll feature:
- A slowly rotating 3D emblem/trophy with particle stars around it
- Motivational text overlay: "IAS 2027 — Tu Banega!" with a countdown timer to UPSC 2027 Prelims
- Inspirational quotes that cycle every few seconds
- Warm gradient background with subtle glow effects
- A "Back to Study" button linking back to dashboard

### Lightweight strategy
- Use simple geometries (torus, sphere, icosahedron) — no heavy 3D models
- Low particle count (~50 stars)
- `frameloop="demand"` or keep animations minimal
- Lazy load the 3D component with `React.lazy`

### Files to create/edit

1. **Install deps**: `@react-three/fiber@^8.18`, `three@^0.160`, `@react-three/drei@^9.122.0`

2. **Create `src/pages/UpscMotivation.tsx`**
   - Full-screen page with Canvas
   - 3D scene: slowly spinning golden icosahedron (trophy-like), orbiting small spheres (stars), subtle ambient + point lights
   - HTML overlay (drei's `Html`): countdown to UPSC 2027 (days remaining), rotating motivational quotes, "IAS Officer Banne Wala Hai Tu 🔥" heading
   - "Back to Study →" button at bottom

3. **Edit `src/App.tsx`** — Add route `/upsc` as child of Index layout

4. **Edit `src/components/Sidebar.tsx`** — Add "UPSC Motivation" nav item with a trophy/target icon

### Quotes pool
- "Discipline is the bridge between goals and accomplishment"
- "UPSC is not about talent, it's about consistency"
- "2027 mein tera naam hoga IAS toppers mein"
- "Har din ka effort compound hota hai"
- "Abhi nahi toh kab? Uth aur padh!"

