import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

let cache: Map<string, string> | null = null;
let inflight: Promise<Map<string, string>> | null = null;

async function loadMap(): Promise<Map<string, string>> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const all = new Map<string, string>();
    const pageSize = 1000;
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from('ssc_word_hindi' as never)
        .select('word_key, hindi')
        .range(from, from + pageSize - 1);
      if (error) break;
      const rows = (data as { word_key: string; hindi: string }[]) || [];
      rows.forEach((r) => all.set(r.word_key, r.hindi));
      if (rows.length < pageSize) break;
      from += pageSize;
    }
    cache = all;
    inflight = null;
    return all;
  })();
  return inflight;
}

export function useWordHindi() {
  const [map, setMap] = useState<Map<string, string>>(cache || new Map());
  useEffect(() => {
    loadMap().then(setMap);
  }, []);
  return map;
}

export function lookupHindi(map: Map<string, string>, text: string | null | undefined): string | null {
  if (!text) return null;
  return map.get(text.trim().toLowerCase()) || null;
}
