
Goal: Keyboard controls wapas chahiye, aur pause par YouTube “More videos” visible na ho.

What I found:
- `useYouTubePlayer.ts` me `disablekb: 1` laga hua hai, isi wajah se YouTube keyboard controls band ho gaye.
- `VideoPlayerView.tsx` me pause overlay transparent hai; isliye recommendations dikhti rehti hain (sirf click block hota hai, visual hide nahi hota).

Implementation plan:
1. Restore keyboard controls
- File: `src/hooks/useYouTubePlayer.ts`
- `playerVars` se `disablekb: 1` remove karna (ya `disablekb: 0` set karna), taaki YouTube ka native keyboard pause/play/seek wapas chale.

2. Replace transparent pause blocker with visual “pause shield”
- File: `src/components/VideoPlayerView.tsx`
- Existing paused overlay ko transparent se opaque/blur shield me convert karna.
- Condition same rahegi: `isReady && !isPlaying`.
- Overlay full player cover karega (`absolute inset-0 z-20`), dark/solid background ke saath taaki recommendations dikh hi na paayen.
- Overlay click par `play()` trigger karega (quick resume behavior).

3. Keep current behavior compatible
- Clip end-time auto-pause logic untouched rahega.
- AI screenshot frame render order preserve karenge taaki AI doubt workflow break na ho.

Technical notes:
- YouTube iframe ke andar recommendations ko truly disable karna possible nahi hota; reliable solution is masking with our own paused layer above iframe.
- `rel=0` and `iv_load_policy=3` already useful hai, but alone enough nahi hote.

Validation checklist:
- Keyboard se pause/play test (K/Space).
- Native YouTube bottom control se pause test.
- Dono cases me “More videos” visible nahi hona chahiye (pause shield cover kare).
- Resume by click test.
- Clip mode (`start/end`) pause-at-end behavior re-test.
