import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { BpscMainsPaper, BpscMainsQuestion, BpscMainsUserAnswer } from '@/types/bpsc';

export function useBpscMainsQuestions(paper?: BpscMainsPaper, year?: number) {
  return useQuery({
    queryKey: ['bpsc-mains-questions', paper, year],
    queryFn: async () => {
      let query = supabase.from('bpsc_mains_questions').select('*');
      if (paper) query = query.eq('paper', paper);
      if (year) query = query.eq('year', year);
      query = query.order('year', { ascending: false }).order('marks', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as BpscMainsQuestion[];
    },
  });
}

export function useBpscMainsPaperCounts() {
  return useQuery({
    queryKey: ['bpsc-mains-paper-counts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bpsc_mains_questions').select('paper');
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((q: any) => {
        counts[q.paper] = (counts[q.paper] || 0) + 1;
      });
      return counts;
    },
  });
}

export function useBpscMainsUserAnswers(questionId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['bpsc-mains-user-answers', user?.id, questionId],
    enabled: !!user,
    queryFn: async () => {
      let query = supabase.from('bpsc_mains_user_answers').select('*').eq('user_id', user!.id);
      if (questionId) query = query.eq('question_id', questionId);
      query = query.order('submitted_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as BpscMainsUserAnswer[];
    },
  });
}

export function useBpscMainsAnsweredIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['bpsc-mains-answered-ids', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bpsc_mains_user_answers')
        .select('question_id')
        .eq('user_id', user!.id);
      if (error) throw error;
      return new Set((data || []).map((d: any) => d.question_id));
    },
  });
}

export function useSubmitMainsAnswer() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      questionId: string;
      answerText: string;
      questionText: string;
      modelAnswer: string | null;
      marks: number;
      wordLimit: number | null;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Call edge function for AI evaluation
      const { data: evalData, error: evalError } = await supabase.functions.invoke('bpsc-mains-evaluate', {
        body: {
          question_text: params.questionText,
          model_answer: params.modelAnswer,
          user_answer: params.answerText,
          marks: params.marks,
          word_limit: params.wordLimit,
        },
      });

      if (evalError) throw evalError;

      const { error } = await supabase.from('bpsc_mains_user_answers').insert({
        user_id: user.id,
        question_id: params.questionId,
        answer_text: params.answerText,
        ai_feedback: evalData?.feedback || null,
        ai_score: evalData?.score ?? null,
      } as any);

      if (error) throw error;
      return evalData;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bpsc-mains-user-answers'] });
      qc.invalidateQueries({ queryKey: ['bpsc-mains-answered-ids'] });
    },
  });
}
