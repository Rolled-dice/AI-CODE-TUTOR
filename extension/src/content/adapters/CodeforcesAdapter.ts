import type { SiteAdapter, Scraped } from '../scraper';

export const CodeforcesAdapter: SiteAdapter = {
  site: 'codeforces',
  matches: (url) => /^https:\/\/codeforces\.com\/(problemset\/problem|contest\/\d+\/problem)\//.test(url),
  scrape(): Scraped | null {
    const root = document.querySelector('.problem-statement');
    if (!root) return null;
    const title = root.querySelector('.title')?.textContent?.trim() ?? '';
    const statement = root.textContent?.trim() ?? '';
    if (!title || !statement) return null;
    return { title, statement };
  },
};
