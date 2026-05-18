/**
 * Content script entry: registers adapters, scrapes once the DOM settles,
 * and forwards the result to the service worker.
 *
 * SPAs (LeetCode) re-render after route changes, so we re-scrape on
 * URL changes and a few `MutationObserver` ticks before giving up.
 */

import { pickAdapter, registerAdapter } from './scraper';
import { LeetCodeAdapter } from './adapters/LeetCodeAdapter';
import { CodeforcesAdapter } from './adapters/CodeforcesAdapter';
import type { ProblemContext } from '../background/service-worker';

registerAdapter(LeetCodeAdapter);
registerAdapter(CodeforcesAdapter);

const MAX_ATTEMPTS = 20;
const ATTEMPT_INTERVAL_MS = 500;

let lastUrl = '';

function trySend(): void {
  const url = location.href;
  const adapter = pickAdapter(url);
  if (!adapter) return;

  let attempts = 0;
  const tick = () => {
    attempts++;
    const result = adapter.scrape();
    if (result) {
      const payload: ProblemContext = {
        site: adapter.site,
        url,
        title: result.title,
        statement: result.statement,
        scrapedAt: Date.now(),
      };
      chrome.runtime.sendMessage({ type: 'CONTEXT_UPDATE', payload });
      return;
    }
    if (attempts < MAX_ATTEMPTS) setTimeout(tick, ATTEMPT_INTERVAL_MS);
  };
  tick();
}

function onUrlMaybeChanged(): void {
  if (location.href === lastUrl) return;
  lastUrl = location.href;
  trySend();
}

onUrlMaybeChanged();

// SPAs swap routes without a full page load — observe and re-scrape.
new MutationObserver(onUrlMaybeChanged).observe(document.body, {
  childList: true,
  subtree: true,
});
