// Core data types for the study application

export interface YouTubeSource {
  id: string;
  type: 'playlist' | 'channel';
  youtubeId: string;
  title: string;
  thumbnailUrl?: string;
  videoCount?: number;
  createdAt: Date;
}

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  thumbnailUrl?: string;
  duration: number; // in seconds
  channelName?: string;
  sourceId?: string; // reference to YouTubeSource
  playlistPosition?: number; // display-only metadata
}

export interface Clip {
  id: string;
  videoId: string;
  video?: Video;
  startTime: number; // in seconds
  endTime: number; // in seconds
  label?: string;
  notes?: string;
  isPrimary: boolean;
  order: number;
  subTopicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubTopic {
  id: string;
  name: string;
  description?: string;
  order: number;
  topicId: string;
  clips?: Clip[];
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  order: number;
  subjectId: string;
  subTopics?: SubTopic[];
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  color?: string;
  order: number;
  examId: string;
  topics?: Topic[];
}

export interface Exam {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  subjects?: Subject[];
  createdAt: Date;
}

// Helper types
export type ClipType = 'primary' | 'supplementary';

export interface TimeRange {
  start: number;
  end: number;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function parseTimeToSeconds(time: string): number {
  const parts = time.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/playlist\?list=([^&\n?#]+)/,
    /youtube\.com\/channel\/([^&\n?#]+)/,
    /youtube\.com\/@([^&\n?#\/]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
