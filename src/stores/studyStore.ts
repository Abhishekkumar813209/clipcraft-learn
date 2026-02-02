import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Exam, Subject, Topic, SubTopic, Clip, YouTubeSource, Video } from '@/types';

interface StudyState {
  // Data
  exams: Exam[];
  sources: YouTubeSource[];
  videos: Video[];
  clips: Clip[];
  
  // Selection state
  selectedExamId: string | null;
  selectedSubjectId: string | null;
  selectedTopicId: string | null;
  selectedSourceId: string | null;
  selectedVideoForPlayer: { videoId: string; title: string } | null;
  selectedSubTopicId: string | null;
  
  // Actions - Exams
  addExam: (exam: Omit<Exam, 'id' | 'createdAt'>) => string;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  
  // Actions - Subjects
  addSubject: (subject: Omit<Subject, 'id' | 'order'>) => string;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  
  // Actions - Topics
  addTopic: (topic: Omit<Topic, 'id' | 'order'>) => string;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  
  // Actions - SubTopics
  addSubTopic: (subTopic: Omit<SubTopic, 'id' | 'order'>) => string;
  updateSubTopic: (id: string, updates: Partial<SubTopic>) => void;
  deleteSubTopic: (id: string) => void;
  reorderSubTopics: (topicId: string, subTopicIds: string[]) => void;
  
  // Actions - Sources
  addSource: (source: Omit<YouTubeSource, 'id' | 'createdAt'>) => string;
  deleteSource: (id: string) => void;
  
  // Actions - Videos
  addVideo: (video: Omit<Video, 'id'>) => string;
  getVideoByYouTubeId: (youtubeId: string) => Video | undefined;
  
  // Actions - Clips
  addClip: (clip: Omit<Clip, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => string;
  updateClip: (id: string, updates: Partial<Clip>) => void;
  deleteClip: (id: string) => void;
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

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      exams: [],
      sources: [],
      videos: [],
      clips: [],
      selectedExamId: null,
      selectedSubjectId: null,
      selectedTopicId: null,
      selectedSubTopicId: null,
      selectedSourceId: null,
      selectedVideoForPlayer: null,
      
      // Exams
      addExam: (exam) => {
        const id = generateId();
        set((state) => ({
          exams: [...state.exams, { ...exam, id, createdAt: new Date() }],
        }));
        return id;
      },
      updateExam: (id, updates) => {
        set((state) => ({
          exams: state.exams.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },
      deleteExam: (id) => {
        set((state) => ({
          exams: state.exams.filter((e) => e.id !== id),
          selectedExamId: state.selectedExamId === id ? null : state.selectedExamId,
        }));
      },
      
      // Subjects
      addSubject: (subject) => {
        const id = generateId();
        const subjects = get().exams.find((e) => e.id === subject.examId)?.subjects || [];
        set((state) => ({
          exams: state.exams.map((e) =>
            e.id === subject.examId
              ? {
                  ...e,
                  subjects: [
                    ...(e.subjects || []),
                    { ...subject, id, order: subjects.length },
                  ],
                }
              : e
          ),
        }));
        return id;
      },
      updateSubject: (id, updates) => {
        set((state) => ({
          exams: state.exams.map((e) => ({
            ...e,
            subjects: e.subjects?.map((s) =>
              s.id === id ? { ...s, ...updates } : s
            ),
          })),
        }));
      },
      deleteSubject: (id) => {
        set((state) => ({
          exams: state.exams.map((e) => ({
            ...e,
            subjects: e.subjects?.filter((s) => s.id !== id),
          })),
          selectedSubjectId: state.selectedSubjectId === id ? null : state.selectedSubjectId,
        }));
      },
      
      // Topics
      addTopic: (topic) => {
        const id = generateId();
        set((state) => ({
          exams: state.exams.map((e) => ({
            ...e,
            subjects: e.subjects?.map((s) =>
              s.id === topic.subjectId
                ? {
                    ...s,
                    topics: [
                      ...(s.topics || []),
                      { ...topic, id, order: (s.topics || []).length },
                    ],
                  }
                : s
            ),
          })),
        }));
        return id;
      },
      updateTopic: (id, updates) => {
        set((state) => ({
          exams: state.exams.map((e) => ({
            ...e,
            subjects: e.subjects?.map((s) => ({
              ...s,
              topics: s.topics?.map((t) =>
                t.id === id ? { ...t, ...updates } : t
              ),
            })),
          })),
        }));
      },
      deleteTopic: (id) => {
        set((state) => ({
          exams: state.exams.map((e) => ({
            ...e,
            subjects: e.subjects?.map((s) => ({
              ...s,
              topics: s.topics?.filter((t) => t.id !== id),
            })),
          })),
          selectedTopicId: state.selectedTopicId === id ? null : state.selectedTopicId,
        }));
      },
      
      // SubTopics
      addSubTopic: (subTopic) => {
        const id = generateId();
        set((state) => ({
          exams: state.exams.map((e) => ({
            ...e,
            subjects: e.subjects?.map((s) => ({
              ...s,
              topics: s.topics?.map((t) =>
                t.id === subTopic.topicId
                  ? {
                      ...t,
                      subTopics: [
                        ...(t.subTopics || []),
                        { ...subTopic, id, order: (t.subTopics || []).length },
                      ],
                    }
                  : t
              ),
            })),
          })),
        }));
        return id;
      },
      updateSubTopic: (id, updates) => {
        set((state) => ({
          exams: state.exams.map((e) => ({
            ...e,
            subjects: e.subjects?.map((s) => ({
              ...s,
              topics: s.topics?.map((t) => ({
                ...t,
                subTopics: t.subTopics?.map((st) =>
                  st.id === id ? { ...st, ...updates } : st
                ),
              })),
            })),
          })),
        }));
      },
      deleteSubTopic: (id) => {
        set((state) => ({
          exams: state.exams.map((e) => ({
            ...e,
            subjects: e.subjects?.map((s) => ({
              ...s,
              topics: s.topics?.map((t) => ({
                ...t,
                subTopics: t.subTopics?.filter((st) => st.id !== id),
              })),
            })),
          })),
          clips: state.clips.filter((c) => c.subTopicId !== id),
          selectedSubTopicId: state.selectedSubTopicId === id ? null : state.selectedSubTopicId,
        }));
      },
      reorderSubTopics: (topicId, subTopicIds) => {
        set((state) => ({
          exams: state.exams.map((e) => ({
            ...e,
            subjects: e.subjects?.map((s) => ({
              ...s,
              topics: s.topics?.map((t) =>
                t.id === topicId
                  ? {
                      ...t,
                      subTopics: subTopicIds.map((id, index) => {
                        const st = t.subTopics?.find((st) => st.id === id);
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
      addSource: (source) => {
        const id = generateId();
        set((state) => ({
          sources: [...state.sources, { ...source, id, createdAt: new Date() }],
        }));
        return id;
      },
      deleteSource: (id) => {
        set((state) => ({
          sources: state.sources.filter((s) => s.id !== id),
        }));
      },
      
      // Videos
      addVideo: (video) => {
        const existing = get().videos.find((v) => v.youtubeId === video.youtubeId);
        if (existing) return existing.id;
        
        const id = generateId();
        set((state) => ({
          videos: [...state.videos, { ...video, id }],
        }));
        return id;
      },
      getVideoByYouTubeId: (youtubeId) => {
        return get().videos.find((v) => v.youtubeId === youtubeId);
      },
      
      // Clips
      addClip: (clip) => {
        const id = generateId();
        const existingClips = get().clips.filter((c) => c.subTopicId === clip.subTopicId);
        const now = new Date();
        set((state) => ({
          clips: [
            ...state.clips,
            { ...clip, id, order: existingClips.length, createdAt: now, updatedAt: now },
          ],
        }));
        return id;
      },
      updateClip: (id, updates) => {
        set((state) => ({
          clips: state.clips.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
          ),
        }));
      },
      deleteClip: (id) => {
        set((state) => ({
          clips: state.clips.filter((c) => c.id !== id),
        }));
      },
      reorderClips: (subTopicId, clipIds) => {
        set((state) => ({
          clips: state.clips.map((c) => {
            if (c.subTopicId !== subTopicId) return c;
            const newOrder = clipIds.indexOf(c.id);
            return newOrder >= 0 ? { ...c, order: newOrder } : c;
          }),
        }));
      },
      getClipsBySubTopic: (subTopicId) => {
        return get()
          .clips.filter((c) => c.subTopicId === subTopicId)
          .sort((a, b) => a.order - b.order);
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
        const exam = get().exams.find((e) => e.id === examId);
        return (exam?.subjects || []).sort((a, b) => a.order - b.order);
      },
      getTopicsBySubject: (subjectId) => {
        for (const exam of get().exams) {
          const subject = exam.subjects?.find((s) => s.id === subjectId);
          if (subject) {
            return (subject.topics || []).sort((a, b) => a.order - b.order);
          }
        }
        return [];
      },
      getSubTopicsByTopic: (topicId) => {
        for (const exam of get().exams) {
          for (const subject of exam.subjects || []) {
            const topic = subject.topics?.find((t) => t.id === topicId);
            if (topic) {
              return (topic.subTopics || []).sort((a, b) => a.order - b.order);
            }
          }
        }
        return [];
      },
    }),
    {
      name: 'study-brain-storage',
    }
  )
);
