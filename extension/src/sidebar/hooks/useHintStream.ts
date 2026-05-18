/**
 * Sends the user prompt + scraped context to the backend and exposes the
 * incremental hint as `text`.
 *
 * The backend currently returns a single JSON response; this hook is
 * shaped for streaming so we can swap to SSE without changing callers.
 */

import { useCallback, useState } from 'react';
import type { ProblemContext } from '../../background/service-worker';

const API_BASE = 'http://localhost:8080';

type State = 'idle' | 'streaming' | 'error';

export function useHintStream() {
  const [text, setText] = useState('');
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (prompt: string, context: ProblemContext | null) => {
    setText('');
    setError(null);
    setState('streaming');
    try {
      const resp = await fetch(`${API_BASE}/api/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = (await resp.json()) as { hint: string };
      setText(data.hint);
      setState('idle');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setState('error');
    }
  }, []);

  return { text, state, error, send };
}
