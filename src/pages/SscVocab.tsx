import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Search, BookOpen } from 'lucide-react';


interface VocabWord {
  id: string;
  root: string | null;
  root_meaning: string | null;
  word: string;
  meaning: string | null;
  source_book: string | null;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function SscVocab() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [words, setWords] = useState<VocabWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [letterFilter, setLetterFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('ssc_vocabulary' as any)
        .select('id, root, root_meaning, word, meaning, source_book')
        .order('word');

      if (!error && data) {
        setWords(data as any);
      }
      setLoading(false);
    };
    fetchWords();
  }, [user]);

  const filtered = useMemo(() => {
    let result = words;
    if (letterFilter) {
      result = result.filter(w => w.word.charAt(0).toUpperCase() === letterFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(w =>
        w.word.includes(q) ||
        (w.root && w.root.includes(q)) ||
        (w.root_meaning && w.root_meaning.toLowerCase().includes(q))
      );
    }
    return result;
  }, [words, letterFilter, search]);

  // Group by root
  const grouped = useMemo(() => {
    const map = new Map<string, VocabWord[]>();
    for (const w of filtered) {
      const key = w.root || '__none__';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(w);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vocabulary</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {loading ? 'Loading...' : `${words.length} words saved`}
          </p>
        </div>
        <Button onClick={() => navigate('/ssc/vocab/upload')} className="gap-2">
          <Upload className="h-4 w-4" /> Upload PDF
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search words, roots, or meanings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setLetterFilter(null)}
            className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
              !letterFilter ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            All
          </button>
          {ALPHABET.map(letter => {
            const count = words.filter(w => w.word.charAt(0).toUpperCase() === letter).length;
            return (
              <button
                key={letter}
                onClick={() => setLetterFilter(letter === letterFilter ? null : letter)}
                disabled={count === 0}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  letterFilter === letter
                    ? 'bg-primary text-primary-foreground'
                    : count === 0
                    ? 'bg-muted/50 text-muted-foreground/30 cursor-not-allowed'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {!loading && filtered.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg text-foreground mb-1">
              {words.length === 0 ? 'No vocabulary yet' : 'No matches found'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {words.length === 0 ? 'Upload a vocabulary PDF to get started.' : 'Try a different search or filter.'}
            </p>
            {words.length === 0 && (
              <Button onClick={() => navigate('/ssc/vocab/upload')} className="gap-2">
                <Upload className="h-4 w-4" /> Upload PDF
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {grouped.map(([root, rootWords]) => (
          <Card key={root} className={root !== '__none__' ? 'cursor-pointer hover:border-primary/40 transition-colors' : ''} onClick={() => root !== '__none__' && navigate(`/ssc/vocab/learn/${encodeURIComponent(root)}`)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                {root !== '__none__' ? (
                  <>
                    <Badge className="font-mono text-sm">{root.toUpperCase()}</Badge>
                    {rootWords[0]?.root_meaning && (
                      <span className="text-sm text-muted-foreground">= {rootWords[0].root_meaning}</span>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground font-medium">No root</span>
                )}
                {root !== '__none__' && (
                  <Badge variant="outline" className="ml-auto text-xs gap-1 text-primary border-primary/30">
                    <BookOpen className="h-3 w-3" /> Learn
                  </Badge>
                )}
                <Badge variant="outline" className={`text-xs ${root !== '__none__' ? '' : 'ml-auto'}`}>{rootWords.length} words</Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {rootWords.map(w => (
                  <Badge key={w.id} variant="secondary" className="text-sm">
                    {w.word}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          Showing {filtered.length} of {words.length} words
        </p>
      )}
    </div>
  );
}
