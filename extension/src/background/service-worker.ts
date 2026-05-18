/**
 * MV3 service worker.
 *
 * Responsibilities:
 *  - Open the side panel when the toolbar action is clicked.
 *  - Cache the latest scraped problem context per tab so the sidebar can
 *    fetch it on open without re-running the content script.
 */

export type ProblemContext = {
  site: 'leetcode' | 'codeforces';
  url: string;
  title: string;
  statement: string;
  scrapedAt: number;
};

type Msg =
  | { type: 'CONTEXT_UPDATE'; payload: ProblemContext }
  | { type: 'CONTEXT_GET'; tabId?: number };

const cache = new Map<number, ProblemContext>();

// Open side panel on toolbar click.
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.windowId !== undefined) {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// Make the side panel available on all pages.
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch(() => {
      /* older Chrome — ignore */
    });
});

chrome.runtime.onMessage.addListener((msg: Msg, sender, sendResponse) => {
  if (msg.type === 'CONTEXT_UPDATE' && sender.tab?.id !== undefined) {
    cache.set(sender.tab.id, msg.payload);
    sendResponse({ ok: true });
    return true;
  }
  if (msg.type === 'CONTEXT_GET') {
    const tabId = msg.tabId;
    if (tabId === undefined) {
      // Fall back to the active tab in the focused window.
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        const id = tabs[0]?.id;
        sendResponse(id !== undefined ? cache.get(id) ?? null : null);
      });
      return true;
    }
    sendResponse(cache.get(tabId) ?? null);
    return true;
  }
  return false;
});

// Drop cache when a tab closes.
chrome.tabs.onRemoved.addListener((tabId) => {
  cache.delete(tabId);
});
