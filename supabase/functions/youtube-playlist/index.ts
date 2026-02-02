import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface PlaylistItem {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: number;
  position: number;
  channelName: string;
}

interface PlaylistResponse {
  videos: PlaylistItem[];
  playlistTitle: string;
  totalResults: number;
  nextPageToken?: string;
}

async function getVideoDurations(
  videoIds: string[],
  apiKey: string
): Promise<Map<string, number>> {
  const durations = new Map<string, number>();
  
  if (videoIds.length === 0) return durations;
  
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(',')}&key=${apiKey}`
  );
  
  if (!response.ok) {
    console.error('Failed to fetch video durations:', await response.text());
    return durations;
  }
  
  const data = await response.json();
  
  for (const item of data.items || []) {
    const duration = parseDuration(item.contentDetails?.duration || 'PT0S');
    durations.set(item.id, duration);
  }
  
  return durations;
}

function parseDuration(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return hours * 3600 + minutes * 60 + seconds;
}

async function fetchPlaylistItems(
  playlistId: string,
  apiKey: string,
  pageToken?: string
): Promise<PlaylistResponse> {
  let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
  
  if (pageToken) {
    url += `&pageToken=${pageToken}`;
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`YouTube API error: ${error}`);
  }
  
  const data = await response.json();
  
  // Get video IDs for duration lookup
  const videoIds = data.items
    ?.map((item: any) => item.snippet?.resourceId?.videoId)
    .filter(Boolean) || [];
  
  const durations = await getVideoDurations(videoIds, apiKey);
  
  const videos: PlaylistItem[] = (data.items || [])
    .filter((item: any) => item.snippet?.resourceId?.videoId)
    .map((item: any, index: number) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || 
                 item.snippet.thumbnails?.default?.url || '',
      duration: durations.get(item.snippet.resourceId.videoId) || 0,
      position: item.snippet.position ?? index,
      channelName: item.snippet.videoOwnerChannelTitle || '',
    }));
  
  return {
    videos,
    playlistTitle: data.items?.[0]?.snippet?.channelTitle || 'Playlist',
    totalResults: data.pageInfo?.totalResults || videos.length,
    nextPageToken: data.nextPageToken,
  };
}

async function fetchAllPlaylistItems(
  playlistId: string,
  apiKey: string
): Promise<PlaylistResponse> {
  let allVideos: PlaylistItem[] = [];
  let pageToken: string | undefined;
  let playlistTitle = '';
  let totalResults = 0;
  
  do {
    const result = await fetchPlaylistItems(playlistId, apiKey, pageToken);
    allVideos = [...allVideos, ...result.videos];
    playlistTitle = result.playlistTitle;
    totalResults = result.totalResults;
    pageToken = result.nextPageToken;
  } while (pageToken);
  
  return {
    videos: allVideos,
    playlistTitle,
    totalResults,
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    
    if (!YOUTUBE_API_KEY) {
      throw new Error('YOUTUBE_API_KEY is not configured');
    }
    
    const url = new URL(req.url);
    const playlistId = url.searchParams.get('playlistId');
    const fetchAll = url.searchParams.get('fetchAll') === 'true';
    const pageToken = url.searchParams.get('pageToken') || undefined;
    
    if (!playlistId) {
      return new Response(
        JSON.stringify({ error: 'playlistId is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    let result: PlaylistResponse;
    
    if (fetchAll) {
      result = await fetchAllPlaylistItems(playlistId, YOUTUBE_API_KEY);
    } else {
      result = await fetchPlaylistItems(playlistId, YOUTUBE_API_KEY, pageToken);
    }
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error: unknown) {
    console.error('Error fetching playlist:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
