import { useState } from 'react';
import { useHintStream } from '../hooks/useHintStream';
import { HintBubble } from './HintBubble';
import type { ProblemContext } from '../../background/service-worker';

type Props = { context: ProblemContext | null };

export function ChatWindow({ context }: Props) {
  const [input, setInput] = useState('');
  const { text, state, error, send } = useHintStream();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state === 'streaming') return;
    send(input.trim(), context);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {text && <HintBubble text={text} />}
        {state === 'streaming' && !text && (
          <p className="text-xs text-slate-400">Thinking…</p>
        )}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
      <form onSubmit={onSubmit} className="border-t border-slate-800 p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          placeholder="Ask for a hint…"
          className="w-full resize-none rounded bg-slate-900 px-2 py-1 text-sm outline-none ring-1 ring-slate-800 focus:ring-slate-600"
        />
        <button
          type="submit"
          disabled={state === 'streaming' || !input.trim()}
          className="mt-2 w-full rounded bg-indigo-600 py-1.5 text-sm font-medium hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-800"
        >
          {state === 'streaming' ? 'Streaming…' : 'Get hint'}
        </button>
      </form>
    </div>
  );
}
