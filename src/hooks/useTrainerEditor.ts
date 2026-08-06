import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { toast } from '@/hooks/use-toast';

/** "x^5" ya "x^{10}" ko x<sup>5</sup> me badal deta hai (editing ke baad). */
function applySuperscripts(html: string): string {
  return html
    .replace(/\^\{([^}]{1,6})\}/g, '<sup>$1</sup>')
    .replace(/\^(-?[0-9a-zA-Z]{1,3})/g, '<sup>$1</sup>');
}

interface EditRow {
  selector: string;
  html: string;
}

/** Nearest editable block around a clicked node. */
const BLOCK_SELECTOR = '.card,.panel,.qa,header,section,article,li,p,h1,h2,h3,h4,td';

function pathOf(el: Element, root: Element): string | null {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node !== root) {
    const parent: Element | null = node.parentElement;
    if (!parent) return null;
    const idx = Array.prototype.indexOf.call(parent.children, node) + 1;
    parts.unshift(`${node.tagName.toLowerCase()}:nth-child(${idx})`);
    node = parent;
  }
  return parts.join('>');
}

function resolve(doc: Document, path: string): Element | null {
  let node: Element = doc.body;
  for (const part of path.split('>')) {
    const m = part.match(/^([a-z0-9-]+):nth-child\((\d+)\)$/i);
    if (!m) return null;
    const next = node.children[Number(m[2]) - 1];
    if (!next || next.tagName.toLowerCase() !== m[1].toLowerCase()) return null;
    node = next as Element;
  }
  return node;
}

/**
 * Trainer HTML pages ko inline edit karne ka support.
 * Sirf admin edit kar sakta hai; edits DB me store hote hain aur
 * har user ke liye load par apply ho jaate hain.
 */
export function useTrainerEditor(trainerKey: string) {
  const { isAdmin } = useIsAdmin();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const editsRef = useRef<EditRow[]>([]);
  const [loadedTick, setLoadedTick] = useState(0);

  // Saved edits fetch
  useEffect(() => {
    let cancelled = false;
    supabase
      .from('trainer_content_edits' as never)
      .select('selector,html')
      .eq('trainer_key', trainerKey)
      .then(({ data }) => {
        if (cancelled) return;
        editsRef.current = (data as unknown as EditRow[]) || [];
        setLoadedTick((t) => t + 1);
      });
    return () => {
      cancelled = true;
    };
  }, [trainerKey]);

  const applyEdits = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc || !doc.body) return;
    for (const e of editsRef.current) {
      const el = resolve(doc, e.selector);
      if (el) el.innerHTML = e.html;
    }
  }, []);

  const [frameReady, setFrameReady] = useState(false);
  const onIframeLoad = useCallback(() => setFrameReady(true), []);

  useEffect(() => {
    if (frameReady) applyEdits();
  }, [frameReady, loadedTick, applyEdits]);

  const save = useCallback(
    async (selector: string, html: string) => {
      setSaving(true);
      const { data: userRes } = await supabase.auth.getUser();
      const { error } = await supabase.from('trainer_content_edits' as never).upsert(
        {
          trainer_key: trainerKey,
          selector,
          html,
          updated_by: userRes.user?.id ?? null,
        } as never,
        { onConflict: 'trainer_key,selector' } as never,
      );
      setSaving(false);
      if (error) {
        toast({ title: 'Save nahi hua', description: error.message, variant: 'destructive' });
        return;
      }
      const existing = editsRef.current.find((e) => e.selector === selector);
      if (existing) existing.html = html;
      else editsRef.current.push({ selector, html });
      toast({ title: 'Saved', description: 'Sab users ko yeh update dikhega.' });
    },
    [trainerKey],
  );

  // "E" = edit mode on, "D" = done (sirf admin ke liye)
  useEffect(() => {
    if (!isAdmin) return;
    const handler = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase();
      if (k !== 'e' && k !== 'd') return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const doc = (ev.target as Node | null)?.ownerDocument ?? document;
      const el = doc.activeElement as HTMLElement | null;
      if (el) {
        const tag = el.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable) return;
      }
      ev.preventDefault();
      setEditMode(k === 'e');
    };

    document.addEventListener('keydown', handler);
    const idoc = iframeRef.current?.contentDocument;
    idoc?.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      idoc?.removeEventListener('keydown', handler);
    };
  }, [isAdmin, frameReady]);

  // Edit mode wiring inside the iframe
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!frameReady || !doc || !doc.body) return;
    if (!isAdmin || !editMode) {
      doc.body.removeAttribute('data-edit-mode');
      doc.querySelectorAll('[contenteditable="true"]').forEach((el) => el.removeAttribute('contenteditable'));
      return;
    }

    doc.body.setAttribute('data-edit-mode', '1');
    const styleId = '__trainer_edit_style';
    if (!doc.getElementById(styleId)) {
      const st = doc.createElement('style');
      st.id = styleId;
      st.textContent = `
        body[data-edit-mode] *:hover:not(html):not(body){ outline:1px dashed rgba(37,99,235,.5); }
        [contenteditable="true"]{ outline:2px solid #2563eb !important; background:rgba(37,99,235,.06); border-radius:4px; }
      `;
      doc.head.appendChild(st);
    }

    const onDblClick = (ev: Event) => {
      const target = ev.target as Element | null;
      if (!target) return;
      const block = (target.closest(BLOCK_SELECTOR) as HTMLElement | null) || (target as HTMLElement);
      if (!block || block === doc.body) return;
      doc.querySelectorAll('[contenteditable="true"]').forEach((el) => {
        if (el !== block) el.removeAttribute('contenteditable');
      });
      block.setAttribute('contenteditable', 'true');
      block.focus();
    };

    const onBlur = (ev: Event) => {
      const el = ev.target as HTMLElement | null;
      if (!el || el.getAttribute?.('contenteditable') !== 'true') return;
      const selector = pathOf(el, doc.body);
      el.removeAttribute('contenteditable');
      if (!selector) return;
      const html = applySuperscripts(el.innerHTML);
      if (html !== el.innerHTML) el.innerHTML = html;
      const prev = editsRef.current.find((e) => e.selector === selector);
      if (prev && prev.html === html) return;
      void save(selector, html);
    };

    const onKeyDown = (ev: KeyboardEvent) => {
      const el = doc.activeElement as HTMLElement | null;
      if (!el || el.getAttribute?.('contenteditable') !== 'true') return;
      if (ev.key === 'Escape') el.blur();
      if (ev.key === 'Enter' && ev.shiftKey) {
        ev.preventDefault();
        doc.execCommand('insertLineBreak');
      }
      // Ctrl/Cmd + ↑ = superscript toggle, Ctrl/Cmd + ↓ = subscript toggle
      if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'ArrowUp' || ev.key === 'ArrowDown')) {
        ev.preventDefault();
        doc.execCommand(ev.key === 'ArrowUp' ? 'superscript' : 'subscript');
        return;
      }
      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') {
        ev.preventDefault();
        el.blur();
      }
    };


    doc.addEventListener('dblclick', onDblClick, true);
    doc.addEventListener('blur', onBlur, true);
    doc.addEventListener('keydown', onKeyDown, true);
    return () => {
      doc.removeEventListener('dblclick', onDblClick, true);
      doc.removeEventListener('blur', onBlur, true);
      doc.removeEventListener('keydown', onKeyDown, true);
    };
  }, [frameReady, isAdmin, editMode, save]);

  return { iframeRef, onIframeLoad, isAdmin, editMode, setEditMode, saving };
}
