import type { SiteAdapter, Scraped } from '../scraper';

export const LeetCodeAdapter: SiteAdapter = {
  site: 'leetcode',
  matches: (url) => /^https:\/\/leetcode\.com\/problems\//.test(url),
  scrape(): Scraped | null {
    // LeetCode's problem statement container; selector is best-effort and
    // intentionally lenient — the site changes class names periodically.
    const titleEl =
      document.querySelector('div[class*="text-title"]') ??
      document.querySelector('a[href^="/problems/"]');
    const bodyEl = document.querySelector('div[data-track-load="description_content"]');

    const title = titleEl?.textContent?.trim() ?? '';
    const statement = bodyEl?.textContent?.trim() ?? '';
    if (!title || !statement) return null;
    return { title, statement };
  },
};
