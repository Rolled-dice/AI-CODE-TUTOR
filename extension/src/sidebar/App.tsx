import { useEffect, useState } from 'react';
import { ChatWindow } from './components/ChatWindow';
import type { ProblemContext } from '../background/service-worker';

export function App() {
  const [ctx, setCtx] = useState<ProblemContext | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'CONTEXT_GET' }, (resp) => {
      setCtx(resp ?? null);
    });
  }, []);

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-slate-800 px-4 py-3">
        <h1 className="text-sm font-semibold tracking-wide">AI Coding Tutor</h1>
        <p className="truncate text-xs text-slate-400">
          {ctx ? `${ctx.site} · ${ctx.title}` : 'No problem detected on this tab.'}
        </p>
      </header>
      <ChatWindow context={ctx} />
    </div>
  );
}
