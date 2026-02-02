import { useEffect, useRef, useState, useCallback } from 'react';

// YouTube IFrame API types
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

interface YTPlayerOptions {
  videoId: string;
  playerVars?: {
    autoplay?: number;
    modestbranding?: number;
    rel?: number;
    enablejsapi?: number;
    origin?: string;
  };
  events?: {
    onReady?: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTPlayerEvent) => void;
    onError?: (event: YTPlayerEvent) => void;
  };
}

interface YTPlayerState {
  PLAYING: number;
  PAUSED: number;
  ENDED: number;
  BUFFERING: number;
}

interface YTApi {
  Player: new (containerId: string, options: YTPlayerOptions) => YTPlayer;
  PlayerState: YTPlayerState;
}

declare global {
  interface Window {
    YT: YTApi;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface UseYouTubePlayerOptions {
  videoId: string;
  containerId: string;
  onReady?: () => void;
  onStateChange?: (state: number) => void;
  onError?: (error: number) => void;
}

interface UseYouTubePlayerReturn {
  player: YTPlayer | null;
  isReady: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
}

let isAPILoaded = false;
let apiLoadPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (isAPILoaded) return Promise.resolve();
  
  if (apiLoadPromise) return apiLoadPromise;
  
  apiLoadPromise = new Promise((resolve) => {
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (existingScript) {
      if (window.YT && window.YT.Player) {
        isAPILoaded = true;
        resolve();
        return;
      }
    }
    
    window.onYouTubeIframeAPIReady = () => {
      isAPILoaded = true;
      resolve();
    };
    
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  });
  
  return apiLoadPromise;
}

export function useYouTubePlayer({
  videoId,
  containerId,
  onReady,
  onStateChange,
  onError,
}: UseYouTubePlayerOptions): UseYouTubePlayerReturn {
  const playerRef = useRef<YTPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startTimeTracking = useCallback(() => {
    if (intervalRef.current) return;
    
    intervalRef.current = window.setInterval(() => {
      if (playerRef.current && isReady) {
        try {
          const time = playerRef.current.getCurrentTime();
          setCurrentTime(Math.floor(time));
        } catch (e) {
          // Player might not be ready
        }
      }
    }, 250);
  }, [isReady]);

  const stopTimeTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initPlayer() {
      await loadYouTubeAPI();
      
      if (!mounted) return;
      
      // Destroy existing player if any
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore
        }
        playerRef.current = null;
      }
      
      const container = document.getElementById(containerId);
      if (!container) return;
      
      playerRef.current = new window.YT.Player(containerId, {
        videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (!mounted) return;
            setIsReady(true);
            setDuration(event.target.getDuration());
            onReady?.();
            startTimeTracking();
          },
          onStateChange: (event) => {
            if (!mounted) return;
            const state = event.data;
            setIsPlaying(state === window.YT.PlayerState.PLAYING);
            onStateChange?.(state);
            
            if (state === window.YT.PlayerState.PLAYING) {
              startTimeTracking();
            }
          },
          onError: (event) => {
            onError?.(event.data);
          },
        },
      });
    }

    initPlayer();

    return () => {
      mounted = false;
      stopTimeTracking();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore
        }
        playerRef.current = null;
      }
    };
  }, [videoId, containerId, onReady, onStateChange, onError, startTimeTracking, stopTimeTracking]);

  const play = useCallback(() => {
    playerRef.current?.playVideo();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setCurrentTime(Math.floor(seconds));
  }, []);

  const getCurrentTime = useCallback(() => {
    if (playerRef.current && isReady) {
      try {
        return playerRef.current.getCurrentTime();
      } catch (e) {
        return currentTime;
      }
    }
    return currentTime;
  }, [isReady, currentTime]);

  return {
    player: playerRef.current,
    isReady,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    seekTo,
    getCurrentTime,
  };
}
