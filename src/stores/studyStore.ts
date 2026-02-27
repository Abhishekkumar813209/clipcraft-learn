import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Exam, Subject, Topic, SubTopic, Clip, YouTubeSource, Video } from '@/types';

interface StudyState {
  // Data
  exams: Exam[];
  sources: YouTubeSource[];
  videos: Video[];
  clips: Clip[];
  loading: boolean;

  // Selection state
  selectedExamId: string | null;
  selectedSubjectId: string | null;
  selectedTopicId: string | null;
  selectedSourceId: string | null;
  selectedVideoForPlayer: { videoId: string; title: string } | null;
  selectedSubTopicId: string | null;

  // Data loading
  fetchAllData: () => Promise<void>;

  // Actions - Exams
  addExam: (exam: Omit<Exam, 'id' | 'createdAt'>) => Promise<string>;
  updateExam: (id: string, updates: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;

  // Actions - Subjects
  addSubject: (subject: Omit<Subject, 'id' | 'order'>) => Promise<string>;
  updateSubject: (id: string, updates: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

  // Actions - Topics
  addTopic: (topic: Omit<Topic, 'id' | 'order'>) => Promise<string>;
  updateTopic: (id: string, updates: Partial<Topic>) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;

  // Actions - SubTopics
  addSubTopic: (subTopic: Omit<SubTopic, 'id' | 'order'>) => Promise<string>;
  updateSubTopic: (id: string, updates: Partial<SubTopic>) => Promise<void>;
  deleteSubTopic: (id: string) => Promise<void>;
  reorderSubTopics: (topicId: string, subTopicIds: string[]) => void;

  // Actions - Sources
  addSource: (source: Omit<YouTubeSource, 'id' | 'createdAt'>) => Promise<string>;
  deleteSource: (id: string) => Promise<void>;

  // Actions - Videos
  addVideo: (video: Omit<Video, 'id'>) => Promise<string>;
  getVideoByYouTubeId: (youtubeId: string) => Video | undefined;

  // Actions - Clips
  addClip: (clip: Omit<Clip, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Promise<string>;
  updateClip: (id: string, updates: Partial<Clip>) => Promise<void>;
  deleteClip: (id: string) => Promise<void>;
  reorderClips: (subTopicId: string, clipIds: string[]) => void;
  getClipsBySubTopic: (subTopicId: string) => Clip[];

  // Selection actions
  setSelectedExam: (id: string | null) => void;
  setSelectedSubject: (id: string | null) => void;
  setSelectedTopic: (id: string | null) => void;
  setSelectedSubTopic: (id: string | null) => void;
  setSelectedSource: (id: string | null) => void;
  setSelectedVideoForPlayer: (video: { videoId: string; title: string } | null) => void;

  // Getters
  getSubjectsByExam: (examId: string) => Subject[];
  getTopicsBySubject: (subjectId: string) => Topic[];
  getSubTopicsByTopic: (topicId: string) => SubTopic[];
}

// Helper to get current user id
async function getUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export const useStudyStore = create<StudyState>()((set, get) => ({
  exams: [],
  sources: [],
  videos: [],
  clips: [],
  loading: false,
  selectedExamId: null,
  selectedSubjectId: null,
  selectedTopicId: null,
  selectedSubTopicId: null,
  selectedSourceId: null,
  selectedVideoForPlayer: null,

  // Fetch all user data from DB and build nested structure
  fetchAllData: async () => {
    set({ loading: true });
    try {
      const userId = await getUserId();

      const [examsRes, subjectsRes, topicsRes, subTopicsRes, videosRes, clipsRes, sourcesRes] = await Promise.all([
        supabase.from('exams').select('*').eq('user_id', userId).order('created_at'),
        supabase.from('subjects').select('*').eq('user_id', userId).order('order'),
        supabase.from('topics').select('*').eq('user_id', userId).order('order'),
        supabase.from('sub_topics').select('*').eq('user_id', userId).order('order'),
        supabase.from('videos').select('*').eq('user_id', userId),
        supabase.from('clips').select('*').eq('user_id', userId).order('order'),
        supabase.from('youtube_sources').select('*').eq('user_id', userId).order('created_at'),
      ]);

      const rawExams = (examsRes.data || []) as any[];
      const rawSubjects = (subjectsRes.data || []) as any[];
      const rawTopics = (topicsRes.data || []) as any[];
      const rawSubTopics = (subTopicsRes.data || []) as any[];
      const rawVideos = (videosRes.data || []) as any[];
      const rawClips = (clipsRes.data || []) as any[];
      const rawSources = (sourcesRes.data || []) as any[];

      // Map DB rows to app types
      const videos: Video[] = rawVideos.map(v => ({
        id: v.id,
        youtubeId: v.youtube_id,
        title: v.title,
        thumbnailUrl: v.thumbnail_url,
        duration: v.duration || 0,
        channelName: v.channel_name,
        sourceId: v.source_id,
        playlistPosition: v.playlist_position,
      }));

      const clips: Clip[] = rawClips.map(c => ({
        id: c.id,
        videoId: c.video_id,
        startTime: c.start_time,
        endTime: c.end_time,
        label: c.label,
        notes: c.notes,
        isPrimary: c.is_primary,
        order: c.order || 0,
        subTopicId: c.sub_topic_id,
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at),
      }));

      // Build nested structure
      const subTopicsMap: Record<string, SubTopic[]> = {};
      for (const st of rawSubTopics) {
        const mapped: SubTopic = {
          id: st.id,
          name: st.name,
          description: st.description,
          order: st.order || 0,
          topicId: st.topic_id,
          clips: clips.filter(c => c.subTopicId === st.id),
        };
        if (!subTopicsMap[st.topic_id]) subTopicsMap[st.topic_id] = [];
        subTopicsMap[st.topic_id].push(mapped);
      }

      const topicsMap: Record<string, Topic[]> = {};
      for (const t of rawTopics) {
        const mapped: Topic = {
          id: t.id,
          name: t.name,
          description: t.description,
          order: t.order || 0,
          subjectId: t.subject_id,
          subTopics: subTopicsMap[t.id] || [],
        };
        if (!topicsMap[t.subject_id]) topicsMap[t.subject_id] = [];
        topicsMap[t.subject_id].push(mapped);
      }

      const subjectsMap: Record<string, Subject[]> = {};
      for (const s of rawSubjects) {
        const mapped: Subject = {
          id: s.id,
          name: s.name,
          description: s.description,
          color: s.color,
          order: s.order || 0,
          examId: s.exam_id,
          topics: topicsMap[s.id] || [],
        };
        if (!subjectsMap[s.exam_id]) subjectsMap[s.exam_id] = [];
        subjectsMap[s.exam_id].push(mapped);
      }

      const exams: Exam[] = rawExams.map(e => ({
        id: e.id,
        name: e.name,
        description: e.description,
        icon: e.icon,
        createdAt: new Date(e.created_at),
        subjects: subjectsMap[e.id] || [],
      }));

      const sources: YouTubeSource[] = rawSources.map(s => ({
        id: s.id,
        type: s.type as 'playlist' | 'channel',
        youtubeId: s.youtube_id,
        title: s.title,
        thumbnailUrl: s.thumbnail_url,
        videoCount: s.video_count,
        createdAt: new Date(s.created_at),
      }));

      set({ exams, videos, clips, sources, loading: false });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      set({ loading: false });
    }
  },

  // Exams
  addExam: async (exam) => {
    const userId = await getUserId();
    const { data, error } = await supabase.from('exams').insert({
      user_id: userId,
      name: exam.name,
      description: exam.description || null,
      icon: exam.icon || '📚',
    }).select().single();
    if (error) throw error;
    const newExam: Exam = {
      id: data.id,
      name: data.name,
      description: data.description,
      icon: data.icon,
      createdAt: new Date(data.created_at),
      subjects: [],
    };
    set(s => ({ exams: [...s.exams, newExam] }));
    return data.id;
  },
  updateExam: async (id, updates) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
    await supabase.from('exams').update(dbUpdates).eq('id', id);
    set(s => ({ exams: s.exams.map(e => e.id === id ? { ...e, ...updates } : e) }));
  },
  deleteExam: async (id) => {
    await supabase.from('exams').delete().eq('id', id);
    set(s => ({
      exams: s.exams.filter(e => e.id !== id),
      selectedExamId: s.selectedExamId === id ? null : s.selectedExamId,
    }));
  },

  // Subjects
  addSubject: async (subject) => {
    const userId = await getUserId();
    const existingSubjects = get().getSubjectsByExam(subject.examId);
    const { data, error } = await supabase.from('subjects').insert({
      user_id: userId,
      exam_id: subject.examId,
      name: subject.name,
      description: subject.description || null,
      color: subject.color || null,
      order: existingSubjects.length,
    }).select().single();
    if (error) throw error;
    const newSubject: Subject = {
      id: data.id,
      name: data.name,
      description: data.description,
      color: data.color,
      order: data.order,
      examId: data.exam_id,
      topics: [],
    };
    set(s => ({
      exams: s.exams.map(e =>
        e.id === subject.examId
          ? { ...e, subjects: [...(e.subjects || []), newSubject] }
          : e
      ),
    }));
    return data.id;
  },
  updateSubject: async (id, updates) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    await supabase.from('subjects').update(dbUpdates).eq('id', id);
    set(s => ({
      exams: s.exams.map(e => ({
        ...e,
        subjects: e.subjects?.map(sub => sub.id === id ? { ...sub, ...updates } : sub),
      })),
    }));
  },
  deleteSubject: async (id) => {
    await supabase.from('subjects').delete().eq('id', id);
    set(s => ({
      exams: s.exams.map(e => ({
        ...e,
        subjects: e.subjects?.filter(sub => sub.id !== id),
      })),
      selectedSubjectId: s.selectedSubjectId === id ? null : s.selectedSubjectId,
    }));
  },

  // Topics
  addTopic: async (topic) => {
    const userId = await getUserId();
    const existingTopics = get().getTopicsBySubject(topic.subjectId);
    const { data, error } = await supabase.from('topics').insert({
      user_id: userId,
      subject_id: topic.subjectId,
      name: topic.name,
      description: topic.description || null,
      order: existingTopics.length,
    }).select().single();
    if (error) throw error;
    const newTopic: Topic = {
      id: data.id,
      name: data.name,
      description: data.description,
      order: data.order,
      subjectId: data.subject_id,
      subTopics: [],
    };
    set(s => ({
      exams: s.exams.map(e => ({
        ...e,
        subjects: e.subjects?.map(sub =>
          sub.id === topic.subjectId
            ? { ...sub, topics: [...(sub.topics || []), newTopic] }
            : sub
        ),
      })),
    }));
    return data.id;
  },
  updateTopic: async (id, updates) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    await supabase.from('topics').update(dbUpdates).eq('id', id);
    set(s => ({
      exams: s.exams.map(e => ({
        ...e,
        subjects: e.subjects?.map(sub => ({
          ...sub,
          topics: sub.topics?.map(t => t.id === id ? { ...t, ...updates } : t),
        })),
      })),
    }));
  },
  deleteTopic: async (id) => {
    await supabase.from('topics').delete().eq('id', id);
    set(s => ({
      exams: s.exams.map(e => ({
        ...e,
        subjects: e.subjects?.map(sub => ({
          ...sub,
          topics: sub.topics?.filter(t => t.id !== id),
        })),
      })),
      selectedTopicId: s.selectedTopicId === id ? null : s.selectedTopicId,
    }));
  },

  // SubTopics
  addSubTopic: async (subTopic) => {
    const userId = await getUserId();
    const existingSTs = get().getSubTopicsByTopic(subTopic.topicId);
    const { data, error } = await supabase.from('sub_topics').insert({
      user_id: userId,
      topic_id: subTopic.topicId,
      name: subTopic.name,
      description: subTopic.description || null,
      order: existingSTs.length,
    }).select().single();
    if (error) throw error;
    const newST: SubTopic = {
      id: data.id,
      name: data.name,
      description: data.description,
      order: data.order,
      topicId: data.topic_id,
      clips: [],
    };
    set(s => ({
      exams: s.exams.map(e => ({
        ...e,
        subjects: e.subjects?.map(sub => ({
          ...sub,
          topics: sub.topics?.map(t =>
            t.id === subTopic.topicId
              ? { ...t, subTopics: [...(t.subTopics || []), newST] }
              : t
          ),
        })),
      })),
    }));
    return data.id;
  },
  updateSubTopic: async (id, updates) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    await supabase.from('sub_topics').update(dbUpdates).eq('id', id);
    set(s => ({
      exams: s.exams.map(e => ({
        ...e,
        subjects: e.subjects?.map(sub => ({
          ...sub,
          topics: sub.topics?.map(t => ({
            ...t,
            subTopics: t.subTopics?.map(st => st.id === id ? { ...st, ...updates } : st),
          })),
        })),
      })),
    }));
  },
  deleteSubTopic: async (id) => {
    await supabase.from('sub_topics').delete().eq('id', id);
    set(s => ({
      exams: s.exams.map(e => ({
        ...e,
        subjects: e.subjects?.map(sub => ({
          ...sub,
          topics: sub.topics?.map(t => ({
            ...t,
            subTopics: t.subTopics?.filter(st => st.id !== id),
          })),
        })),
      })),
      clips: s.clips.filter(c => c.subTopicId !== id),
      selectedSubTopicId: s.selectedSubTopicId === id ? null : s.selectedSubTopicId,
    }));
  },
  reorderSubTopics: (topicId, subTopicIds) => {
    set(s => ({
      exams: s.exams.map(e => ({
        ...e,
        subjects: e.subjects?.map(sub => ({
          ...sub,
          topics: sub.topics?.map(t =>
            t.id === topicId
              ? {
                  ...t,
                  subTopics: subTopicIds.map((id, index) => {
                    const st = t.subTopics?.find(st => st.id === id);
                    return st ? { ...st, order: index } : null;
                  }).filter(Boolean) as SubTopic[],
                }
              : t
          ),
        })),
      })),
    }));
  },

  // Sources
  addSource: async (source) => {
    const userId = await getUserId();
    const { data, error } = await supabase.from('youtube_sources').insert({
      user_id: userId,
      type: source.type,
      youtube_id: source.youtubeId,
      title: source.title,
      thumbnail_url: source.thumbnailUrl || null,
      video_count: source.videoCount || 0,
    }).select().single();
    if (error) throw error;
    const newSource: YouTubeSource = {
      id: data.id,
      type: data.type as 'playlist' | 'channel',
      youtubeId: data.youtube_id,
      title: data.title,
      thumbnailUrl: data.thumbnail_url,
      videoCount: data.video_count,
      createdAt: new Date(data.created_at),
    };
    set(s => ({ sources: [...s.sources, newSource] }));
    return data.id;
  },
  deleteSource: async (id) => {
    await supabase.from('youtube_sources').delete().eq('id', id);
    set(s => ({ sources: s.sources.filter(src => src.id !== id) }));
  },

  // Videos
  addVideo: async (video) => {
    const existing = get().videos.find(v => v.youtubeId === video.youtubeId);
    if (existing) return existing.id;

    const userId = await getUserId();
    const { data, error } = await supabase.from('videos').insert({
      user_id: userId,
      youtube_id: video.youtubeId,
      title: video.title,
      thumbnail_url: video.thumbnailUrl || null,
      duration: video.duration || 0,
      channel_name: video.channelName || null,
      source_id: video.sourceId || null,
      playlist_position: video.playlistPosition || null,
    }).select().single();
    if (error) throw error;
    const newVideo: Video = {
      id: data.id,
      youtubeId: data.youtube_id,
      title: data.title,
      thumbnailUrl: data.thumbnail_url,
      duration: data.duration || 0,
      channelName: data.channel_name,
      sourceId: data.source_id,
      playlistPosition: data.playlist_position,
    };
    set(s => ({ videos: [...s.videos, newVideo] }));
    return data.id;
  },
  getVideoByYouTubeId: (youtubeId) => {
    return get().videos.find(v => v.youtubeId === youtubeId);
  },

  // Clips
  addClip: async (clip) => {
    const userId = await getUserId();
    const existingClips = get().clips.filter(c => c.subTopicId === clip.subTopicId);
    const { data, error } = await supabase.from('clips').insert({
      user_id: userId,
      video_id: clip.videoId,
      sub_topic_id: clip.subTopicId,
      start_time: clip.startTime,
      end_time: clip.endTime,
      label: clip.label || null,
      notes: clip.notes || null,
      is_primary: clip.isPrimary,
      order: existingClips.length,
    }).select().single();
    if (error) throw error;
    const newClip: Clip = {
      id: data.id,
      videoId: data.video_id,
      startTime: data.start_time,
      endTime: data.end_time,
      label: data.label,
      notes: data.notes,
      isPrimary: data.is_primary,
      order: data.order || 0,
      subTopicId: data.sub_topic_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
    set(s => ({ clips: [...s.clips, newClip] }));
    return data.id;
  },
  updateClip: async (id, updates) => {
    const dbUpdates: any = {};
    if (updates.label !== undefined) dbUpdates.label = updates.label;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.isPrimary !== undefined) dbUpdates.is_primary = updates.isPrimary;
    if (updates.startTime !== undefined) dbUpdates.start_time = updates.startTime;
    if (updates.endTime !== undefined) dbUpdates.end_time = updates.endTime;
    dbUpdates.updated_at = new Date().toISOString();
    await supabase.from('clips').update(dbUpdates).eq('id', id);
    set(s => ({
      clips: s.clips.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c),
    }));
  },
  deleteClip: async (id) => {
    await supabase.from('clips').delete().eq('id', id);
    set(s => ({ clips: s.clips.filter(c => c.id !== id) }));
  },
  reorderClips: (subTopicId, clipIds) => {
    set(s => ({
      clips: s.clips.map(c => {
        if (c.subTopicId !== subTopicId) return c;
        const newOrder = clipIds.indexOf(c.id);
        return newOrder >= 0 ? { ...c, order: newOrder } : c;
      }),
    }));
  },
  getClipsBySubTopic: (subTopicId) => {
    return get().clips.filter(c => c.subTopicId === subTopicId).sort((a, b) => a.order - b.order);
  },

  // Selection
  setSelectedExam: (id) => set({ selectedExamId: id, selectedSubjectId: null, selectedTopicId: null, selectedSubTopicId: null }),
  setSelectedSubject: (id) => set({ selectedSubjectId: id, selectedTopicId: null, selectedSubTopicId: null }),
  setSelectedTopic: (id) => set({ selectedTopicId: id, selectedSubTopicId: null }),
  setSelectedSubTopic: (id) => set({ selectedSubTopicId: id }),
  setSelectedSource: (id) => set({ selectedSourceId: id }),
  setSelectedVideoForPlayer: (video) => set({ selectedVideoForPlayer: video }),

  // Getters
  getSubjectsByExam: (examId) => {
    const exam = get().exams.find(e => e.id === examId);
    return (exam?.subjects || []).sort((a, b) => a.order - b.order);
  },
  getTopicsBySubject: (subjectId) => {
    for (const exam of get().exams) {
      const subject = exam.subjects?.find(s => s.id === subjectId);
      if (subject) return (subject.topics || []).sort((a, b) => a.order - b.order);
    }
    return [];
  },
  getSubTopicsByTopic: (topicId) => {
    for (const exam of get().exams) {
      for (const subject of exam.subjects || []) {
        const topic = subject.topics?.find(t => t.id === topicId);
        if (topic) return (topic.subTopics || []).sort((a, b) => a.order - b.order);
      }
    }
    return [];
  },
}));
