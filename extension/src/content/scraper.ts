/**
 * SiteAdapter contract + registry.
 *
 * Each adapter knows how to detect and scrape one site. The registry picks
 * the first adapter whose `matches(url)` returns true.
 */

export type Scraped = {
  title: string;
  statement: string;
};

export interface SiteAdapter {
  readonly site: 'leetcode' | 'codeforces';
  matches(url: string): boolean;
  /** Returns null if the page isn't ready yet (e.g. SPA mid-render). */
  scrape(): Scraped | null;
}

const adapters: SiteAdapter[] = [];

export function registerAdapter(a: SiteAdapter): void {
  adapters.push(a);
}

export function pickAdapter(url: string): SiteAdapter | null {
  return adapters.find((a) => a.matches(url)) ?? null;
}
