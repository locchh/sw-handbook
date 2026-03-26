## Handle documentation link
1. Check `<url>/llms.txt` — if it exists, use it as the index (Read https://llmstxt.org/ for more information)
2. Traverse links in `llms.txt` with `curl` + `grep` to find relevant sections
3. If no `llms.txt`, fall back to WebFetch, WebSearch, or Playwright
