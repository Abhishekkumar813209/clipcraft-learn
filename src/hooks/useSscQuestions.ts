import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SscQuestion, SscTopic } from '@/types/ssc';

export function useSscQuestions(topic?: SscTopic) {
  return useQuery({
    queryKey: ['ssc-questions', topic],
    queryFn: async () => {
      let query = supabase.from('ssc_questions').select('*');
      if (topic) query = query.eq('topic', topic as never);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((q: any) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      })) as SscQuestion[];
    },
  });
}

export function useSscQuestionCount() {
  return useQuery({
    queryKey: ['ssc-question-counts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ssc_questions').select('topic');
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((q: any) => {
        counts[q.topic] = (counts[q.topic] || 0) + 1;
      });
      return counts;
    },
  });
}
