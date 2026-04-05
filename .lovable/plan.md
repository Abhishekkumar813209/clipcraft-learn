

## Plan: Add Weekly Planned vs Actual Bar Chart

### What
Add a recharts `BarChart` section to the Productivity Coach page, positioned right below the Monthly Activity grid. It will show the last 7 days with two bars per day: Planned (blue) and Actual (green).

### Changes — `src/pages/ProductivityCoach.tsx`

1. **Import** `BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend` from `recharts`
2. **Compute `weeklyData`** via `useMemo` — take last 7 days from `last30`, map each to `{ day: "Mon", planned: X, actual: Y }` using `logMap`
3. **Render** a new card section below the Monthly Activity card:
   - Title: "Weekly Overview" with `TrendingUp` icon
   - `ResponsiveContainer` (height ~220px) wrapping a `BarChart`
   - Two `Bar` components: Planned (soft blue `hsl(220 70% 60%)`) and Actual (green `hsl(142 60% 45%)`)
   - X-axis shows short day names (Mon, Tue, etc.)
   - Y-axis shows hours
   - Custom rounded bar radius

### Files Modified
- `src/pages/ProductivityCoach.tsx` — Add imports, data computation, and chart JSX

