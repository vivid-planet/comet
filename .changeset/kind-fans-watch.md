---
"@comet/cms-api": patch
---

Fix encoding of special characters in names of uploaded files

For example:

Previously: 
- `€.jpg` -> `a.jpg`
- `ä.jpg` -> `ai.jpg`

Now: 
- `€.jpg` -> `euro.jpg`
- `ä.jpg` -> `ae.jpg`
