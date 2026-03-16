import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { NQT_ALL_TOPICS } from '@/types/nqt';

export function useNqtTodayStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['nqt-today-stats', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('ssc_user_stats')
        .select('*')
        .eq('user_id', user!.id)
        .eq('date', today)
        .maybeSingle();
      return data || { questions_solved: 0, correct_count: 0, streak_days: 0, xp_points: 0 };
    },
  });
}

export function useNqtTopicAccuracy() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['nqt-topic-accuracy', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('ssc_user_progress')
        .select('question_id, is_correct, ssc_questions!inner(topic)')
        .eq('user_id', user!.id);

      const stats: Record<string, { total: number; correct: number }> = {};
      (data || []).forEach((p: any) => {
        const topic = p.ssc_questions?.topic;
        if (!topic || !NQT_ALL_TOPICS.includes(topic)) return;
        if (!stats[topic]) stats[topic] = { total: 0, correct: 0 };
        stats[topic].total++;
        if (p.is_correct) stats[topic].correct++;
      });
      return stats;
    },
  });
}

export function useNqtSubmitAnswer() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: { questionId: string; isCorrect: boolean; timeTaken: number }) => {
      if (!user) throw new Error('Not authenticated');

      await supabase.from('ssc_user_progress').insert({
        user_id: user.id,
        question_id: params.questionId,
        is_correct: params.isCorrect,
        time_taken_seconds: params.timeTaken,
      });

      const today = new Date().toISOString().split('T')[0];
      const { data: existing } = await supabase
        .from('ssc_user_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (existing) {
        await supabase.from('ssc_user_stats').update({
          questions_solved: existing.questions_solved + 1,
          correct_count: existing.correct_count + (params.isCorrect ? 1 : 0),
          xp_points: existing.xp_points + (params.isCorrect ? 10 : 2),
        }).eq('id', existing.id);
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const { data: yesterdayStats } = await supabase
          .from('ssc_user_stats')
          .select('streak_days')
          .eq('user_id', user.id)
          .eq('date', yesterday.toISOString().split('T')[0])
          .maybeSingle();

        await supabase.from('ssc_user_stats').insert({
          user_id: user.id,
          date: today,
          questions_solved: 1,
          correct_count: params.isCorrect ? 1 : 0,
          streak_days: (yesterdayStats?.streak_days || 0) + 1,
          xp_points: params.isCorrect ? 10 : 2,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nqt-today-stats'] });
      qc.invalidateQueries({ queryKey: ['nqt-topic-accuracy'] });
    },
  });
}
