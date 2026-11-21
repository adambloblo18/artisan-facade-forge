# Architecture rules

- Define responsive hero candidates and sizes in a browser-safe module; rely on React SSR's automatic image preload rather than adding a duplicate route-head link.
- Keep consent defaults synchronous and schedule Google tag loading after the page load event plus one second to avoid competing with the hero image.
- Start reveal observers in the content route after hydration, not in the root before lazy route hydration, to avoid mutating server-rendered classes too early.
