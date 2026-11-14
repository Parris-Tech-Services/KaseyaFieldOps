import type { ReactNode } from 'react';

// Renders the light markdown used in lesson sections (paragraphs, "- " and
// "1. " lists, **bold**, `code`) as React elements, never as raw HTML.

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="text-textMain">{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="px-1 rounded bg-slate-100 dark:bg-slate-800 text-[0.9em]">{part.slice(1, -1)}</code>;
    return part;
  });
}

export function LessonText({ body }: { body: string }) {
  const blocks = body.split(/\n\s*\n/).map((b) => b.split('\n').filter((l) => l.trim() !== ''));
  return (
    <div className="space-y-3 text-sm text-textMuted leading-relaxed">
      {blocks.map((lines, i) => {
        if (lines.every((l) => /^\s*- /.test(l))) {
          return <ul key={i} className="list-disc pl-5 space-y-1">{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*- /, ''))}</li>)}</ul>;
        }
        if (lines.every((l) => /^\s*\d+\. /.test(l))) {
          return <ol key={i} className="list-decimal pl-5 space-y-1">{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*\d+\. /, ''))}</li>)}</ol>;
        }
        return <p key={i}>{lines.map((l, j) => <span key={j}>{j > 0 && <br />}{inline(l)}</span>)}</p>;
      })}
    </div>
  );
}
