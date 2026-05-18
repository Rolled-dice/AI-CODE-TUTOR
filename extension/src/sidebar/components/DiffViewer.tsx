/**
 * Minimal side-by-side diff. Intentionally tiny — swap in a real diff
 * library (e.g. diff2html) when this needs to handle real reviews.
 */

type Props = { before: string; after: string };

export function DiffViewer({ before, after }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
      <pre className="whitespace-pre-wrap rounded bg-rose-950/40 p-2 ring-1 ring-rose-900">
        {before}
      </pre>
      <pre className="whitespace-pre-wrap rounded bg-emerald-950/40 p-2 ring-1 ring-emerald-900">
        {after}
      </pre>
    </div>
  );
}
