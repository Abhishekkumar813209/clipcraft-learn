import { supabase } from '@/integrations/supabase/client';
import { useEffect, useRef, useState, useCallback } from 'react';

export type BookmarkKind = 'question' | 'option';
export type BookmarkSubject = 'english' | 'maths' | 'reasoning' | 'gk';

export interface BookmarkInput {
  kind: BookmarkKind;
  subject: BookmarkSubject;
  chapter: string;             // e.g. 'idiom', 'ows', 'syn_ant', 'grammar_verb_basic', 'calc_squares'
  subcategory?: string | null;
  item_ref?: string | null;    // source item id / slug for dedupe
  question_text: string;
  option_text?: string | null;
  correct_text?: string | null;
  meta?: Record<string, unknown> | null;
}

export interface BookmarkRow extends BookmarkInput {
  id: string;
  user_id: string;
  created_at: string;
}

export async function toggleBookmark(userId: string, input: BookmarkInput): Promise<'added' | 'removed'> {
  // Look up existing dedupe (NULL-safe for item_ref / option_text)
  let q = supabase
    .from('ssc_bookmarks' as never)
    .select('id')
    .eq('user_id', userId)
    .eq('kind', input.kind)
    .eq('chapter', input.chapter);
  q = input.item_ref ? q.eq('item_ref', input.item_ref) : q.is('item_ref', null as never);
  q = input.option_text ? q.eq('option_text', input.option_text) : q.is('option_text', null as never);
  const { data: existing } = await q.maybeSingle();
  if (existing) {
    await supabase.from('ssc_bookmarks' as never).delete().eq('id', (existing as any).id);
    return 'removed';
  }
  await supabase.from('ssc_bookmarks' as never).insert({
    user_id: userId,
    kind: input.kind,
    subject: input.subject,
    chapter: input.chapter,
    subcategory: input.subcategory || null,
    item_ref: input.item_ref || null,
    question_text: input.question_text,
    option_text: input.option_text || null,
    correct_text: input.correct_text || null,
    meta: input.meta || null,
  } as never);
  return 'added';
}

// Fetch bookmarked item_refs + option keys for a user in a specific chapter.
// Used by practice pages to show "already bookmarked" state and by the
// bookmark-quiz mode to restrict question set to bookmarked items only.
export async function fetchChapterBookmarks(userId: string, chapter: string): Promise<{
  qRefs: Set<string>;
  oKeys: Set<string>; // `${item_ref}||${option_text}`
}> {
  const { data } = await supabase
    .from('ssc_bookmarks' as never)
    .select('kind,item_ref,option_text')
    .eq('user_id', userId)
    .eq('chapter', chapter);
  const qRefs = new Set<string>();
  const oKeys = new Set<string>();
  for (const r of (data as any[]) || []) {
    if (!r.item_ref) continue;
    if (r.kind === 'question') qRefs.add(r.item_ref);
    else if (r.kind === 'option' && r.option_text) oKeys.add(`${r.item_ref}||${r.option_text}`);
  }
  return { qRefs, oKeys };
}

// Horizontal-swipe detector. Fires onSwipe on any horizontal drag > threshold px.
export function useHorizontalSwipe(onSwipe: () => void, threshold = 60) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  return {
    onPointerDown: (e: React.PointerEvent) => { startX.current = e.clientX; startY.current = e.clientY; },
    onPointerUp: (e: React.PointerEvent) => {
      if (startX.current == null || startY.current == null) return;
      const dx = e.clientX - startX.current;
      const dy = e.clientY - startY.current;
      startX.current = null; startY.current = null;
      if (Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy) * 1.5) {
        onSwipe();
      }
    },
    onPointerCancel: () => { startX.current = null; startY.current = null; },
  };
}

// Fetch all bookmarks for user grouped by subject and chapter.
export function useBookmarks(userId?: string) {
  const [rows, setRows] = useState<BookmarkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    if (!userId) { setRows([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('ssc_bookmarks' as never)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setRows((data as BookmarkRow[]) || []);
    setLoading(false);
  }, [userId]);
  useEffect(() => { load(); }, [load]);
  return { rows, loading, reload: load };
}

export const CHAPTER_LABELS: Record<string, string> = {
  idiom: 'Idioms & Phrases',
  ows: 'One Word Substitution',
  syn_ant: 'Synonyms & Antonyms',
  grammar_verb_basic: 'Grammar · Verb Basic',
  grammar_tense_basic: 'Grammar · Tense Basic',
  grammar_voice_basic: 'Grammar · Passive Voice Basic',
  grammar_narration_basic: 'Grammar · Narration Basic',
  calc_squares: 'Calc · Squares',
  calc_sqroots: 'Calc · Square Roots',
  calc_cubes: 'Calc · Cubes',
  calc_cbroots: 'Calc · Cube Roots',
  calc_pct_conv: 'Calc · % ↔ Fraction Conversion',
  calc_pct_calc: 'Calc · % / Decimal Multiplication',
};

export const SUBJECT_LABELS: Record<BookmarkSubject, string> = {
  english: 'English',
  maths: 'Maths',
  reasoning: 'Reasoning',
  gk: 'GK / GS',
};
