import { BBItem } from '@/lib/blackBookQuiz';
import { Badge } from '@/components/ui/badge';

export function BlackBookExplanation({ item }: { item: BBItem }) {
  if (!item) return null;

  if (item.category === 'syn_ant') {
    return (
      <div className="rounded-md border border-blue-900/40 bg-slate-900/60 p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-semibold text-blue-200">{item.prompt}</span>
          {item.pos && <Badge variant="outline" className="text-xs">{item.pos}</Badge>}
          {item.hindi_meaning && (
            <span className="text-base text-amber-300 font-medium">{item.hindi_meaning}</span>
          )}
        </div>
        {item.english_meaning && (
          <div className="text-sm text-slate-300">{item.english_meaning}</div>
        )}
        {!!item.synonyms?.length && (
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 mr-1">Synonyms:</span>
            {item.synonyms.map((s) => (
              <Badge key={s} className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20">{s}</Badge>
            ))}
          </div>
        )}
        {!!item.antonyms?.length && (
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 mr-1">Antonyms:</span>
            {item.antonyms.map((a) => (
              <Badge key={a} className="bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/20">{a}</Badge>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.category === 'idiom') {
    return (
      <div className="rounded-md border border-indigo-900/40 bg-slate-900/60 p-4 space-y-2">
        <div className="text-lg font-semibold text-indigo-200">"{item.prompt}"</div>
        {item.english_meaning && (
          <div className="text-sm text-slate-200"><span className="text-slate-400">EN:</span> {item.english_meaning}</div>
        )}
        {item.hinglish_meaning && (
          <div className="text-sm text-amber-200"><span className="text-slate-400">Hinglish:</span> {item.hinglish_meaning}</div>
        )}
        {item.example && (
          <div className="text-sm italic text-slate-300 border-l-2 border-indigo-500 pl-3">e.g. {item.example}</div>
        )}
      </div>
    );
  }

  // ows
  return (
    <div className="rounded-md border border-sky-900/40 bg-slate-900/60 p-4 space-y-2">
      <div className="text-sm text-slate-400">{item.prompt}</div>
      <div className="text-lg font-semibold text-sky-200">→ {item.answer}</div>
      {item.hinglish_meaning && (
        <div className="text-sm text-amber-200"><span className="text-slate-400">Hinglish:</span> {item.hinglish_meaning}</div>
      )}
      {item.hindi_meaning && (
        <div className="text-sm text-amber-300">{item.hindi_meaning}</div>
      )}
    </div>
  );
}
