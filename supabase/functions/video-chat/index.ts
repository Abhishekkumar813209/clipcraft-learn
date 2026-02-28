import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Fetch YouTube auto-generated transcript using the innertube API.
 * Falls back gracefully if no captions are available.
 */
async function fetchYouTubeTranscript(videoId: string): Promise<string | null> {
  try {
    // Step 1: Get the video page to extract captions track URL
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const res = await fetch(watchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    const html = await res.text();

    // Extract captions JSON from the page
    const captionMatch = html.match(/"captions":\s*(\{.*?"playerCaptionsTracklistRenderer".*?\})\s*,\s*"videoDetails"/s);
    if (!captionMatch) {
      console.log("No captions found for video", videoId);
      return null;
    }

    let captionsJson: any;
    try {
      captionsJson = JSON.parse(captionMatch[1]);
    } catch {
      console.log("Failed to parse captions JSON");
      return null;
    }

    const tracks = captionsJson?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!tracks || tracks.length === 0) return null;

    // Prefer English, fall back to first available
    const enTrack = tracks.find((t: any) => t.languageCode === "en") || tracks[0];
    const captionUrl = enTrack.baseUrl;

    // Step 2: Fetch the actual transcript XML
    const captionRes = await fetch(`${captionUrl}&fmt=json3`);
    const captionData = await captionRes.json();

    if (!captionData?.events) return null;

    // Build timestamped transcript
    const lines: string[] = [];
    for (const event of captionData.events) {
      if (!event.segs) continue;
      const text = event.segs.map((s: any) => s.utf8 || "").join("").trim();
      if (!text) continue;
      const startSec = Math.floor((event.tStartMs || 0) / 1000);
      const mins = Math.floor(startSec / 60);
      const secs = startSec % 60;
      lines.push(`[${mins}:${secs.toString().padStart(2, "0")}] ${text}`);
    }

    return lines.join("\n");
  } catch (e) {
    console.error("Transcript fetch error:", e);
    return null;
  }
}

/**
 * Extract transcript lines between startTime and endTime (in seconds).
 */
function filterTranscriptByTime(transcript: string, startTime?: number, endTime?: number): string {
  if (startTime === undefined && endTime === undefined) return transcript;

  const lines = transcript.split("\n");
  const filtered: string[] = [];

  for (const line of lines) {
    const match = line.match(/^\[(\d+):(\d+)\]/);
    if (!match) { filtered.push(line); continue; }
    const timeSec = parseInt(match[1]) * 60 + parseInt(match[2]);
    if (startTime !== undefined && timeSec < startTime) continue;
    if (endTime !== undefined && timeSec > endTime) continue;
    filtered.push(line);
  }

  return filtered.join("\n");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, videoId, videoTitle, currentTime, startTime, endTime } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch transcript (cached per function invocation)
    let transcript = await fetchYouTubeTranscript(videoId);
    let contextInfo = "";

    if (transcript) {
      // If user specified a time range, filter transcript
      if (startTime !== undefined || endTime !== undefined) {
        const filtered = filterTranscriptByTime(transcript, startTime, endTime);
        contextInfo = `VIDEO TITLE: "${videoTitle}"\nTIME RANGE: ${formatTime(startTime || 0)} to ${formatTime(endTime || 0)}\n\nTRANSCRIPT FOR THIS SECTION:\n${filtered}`;
      } else {
        // Give context around current timestamp (±2 minutes)
        const nearbyStart = Math.max(0, (currentTime || 0) - 120);
        const nearbyEnd = (currentTime || 0) + 120;
        const nearbyTranscript = filterTranscriptByTime(transcript, nearbyStart, nearbyEnd);
        contextInfo = `VIDEO TITLE: "${videoTitle}"\nCURRENT TIMESTAMP: ${formatTime(currentTime || 0)}\n\nNEARBY TRANSCRIPT (±2 min around current time):\n${nearbyTranscript}\n\nFULL TRANSCRIPT AVAILABLE: Yes (${transcript.split("\n").length} lines)`;
      }
    } else {
      contextInfo = `VIDEO TITLE: "${videoTitle}"\nCURRENT TIMESTAMP: ${formatTime(currentTime || 0)}\nTRANSCRIPT: Not available for this video. Answer based on the video title and user's description of what they see.`;
    }

    const systemPrompt = `You are an AI teaching assistant helping a student understand a YouTube lecture video. You have access to the video's transcript with timestamps.

${contextInfo}

INSTRUCTIONS:
- Answer the student's questions about what the instructor is teaching
- If they ask "what is he doing?" or "explain this", refer to the transcript content around the current timestamp
- If they set a time range, focus your explanation on that specific section
- Explain concepts in simple terms, use examples when helpful
- You can respond in Hindi or English based on what the student uses
- Be encouraging and supportive like a friendly tutor
- Use markdown formatting for clarity
- If transcript is not available, let the student know and ask them to describe what they see`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("video-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
