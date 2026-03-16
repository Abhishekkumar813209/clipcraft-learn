import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NQT_ALL_TOPICS, type NqtTopic, type NqtQuestion } from '@/types/nqt';

export function useNqtQuestions(topic?: NqtTopic) {
  return useQuery({
    queryKey: ['nqt-questions', topic],
    queryFn: async () => {
      let query = supabase.from('ssc_questions').select('*');
      if (topic) {
        query = query.eq('topic', topic);
      } else {
        query = query.in('topic', [...NQT_ALL_TOPICS]);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((q: any) => ({
        id: q.id,
        topic: q.topic,
        question_text: q.question_text,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        correct_option: q.correct_option,
        explanation: q.explanation,
        difficulty: q.difficulty,
      })) as NqtQuestion[];
    },
  });
}

export function useNqtQuestionCount() {
  return useQuery({
    queryKey: ['nqt-question-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ssc_questions')
        .select('topic')
        .in('topic', [...NQT_ALL_TOPICS]);
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((q: any) => {
        counts[q.topic] = (counts[q.topic] || 0) + 1;
      });
      return counts;
    },
  });
}
