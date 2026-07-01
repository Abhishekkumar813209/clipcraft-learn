import { BBItem } from '@/lib/blackBookQuiz';
import { Badge } from '@/components/ui/badge';

export function BlackBookExplanation({ item }: { item: BBItem }) {
  if (!item) return null;

  if (item.category === 'syn_ant') {
    return (
      <div className="rounded-md border border-emerald-200 bg-white p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-semibold text-emerald-700">{item.prompt}</span>
          {item.pos && <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700">{item.pos}</Badge>}
          {item.hindi_meaning && (
            <span className="text-base text-amber-700 font-medium">{item.hindi_meaning}</span>
          )}
        </div>
        {item.english_meaning && (
          <div className="text-sm text-slate-600">{item.english_meaning}</div>
        )}
        {!!item.synonyms?.length && (
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 mr-1">Synonyms:</span>
            {item.synonyms.map((s) => (
              <Badge key={s} className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">{s}</Badge>
            ))}
          </div>
        )}
        {!!item.antonyms?.length && (
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 mr-1">Antonyms:</span>
            {item.antonyms.map((a) => (
              <Badge key={a} className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100">{a}</Badge>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.category === 'idiom') {
    return (
      <div className="rounded-md border border-teal-200 bg-white p-4 space-y-2 shadow-sm">
        <div className="text-lg font-semibold text-teal-700">"{item.prompt}"</div>
        {item.english_meaning && (
          <div className="text-sm text-slate-700"><span className="text-slate-500">EN:</span> {item.english_meaning}</div>
        )}
        {item.hinglish_meaning && (
          <div className="text-sm text-amber-700"><span className="text-slate-500">Hinglish:</span> {item.hinglish_meaning}</div>
        )}
        {item.example && (
          <div className="text-sm italic text-slate-600 border-l-2 border-teal-400 pl-3">e.g. {item.example}</div>
        )}
      </div>
    );
  }

  // ows
  return (
    <div className="rounded-md border border-emerald-200 bg-white p-4 space-y-2 shadow-sm">
      <div className="text-sm text-slate-600">{item.prompt}</div>
      <div className="text-lg font-semibold text-emerald-700">→ {item.answer}</div>
      {item.hinglish_meaning && (
        <div className="text-sm text-amber-700"><span className="text-slate-500">Hinglish:</span> {item.hinglish_meaning}</div>
      )}
      {item.hindi_meaning && (
        <div className="text-sm text-amber-700">{item.hindi_meaning}</div>
      )}
    </div>
  );
}
