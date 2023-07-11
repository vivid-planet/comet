---
"@comet/cms-admin": minor
---

Silence polling errors in page tree

Errors during polling (pages query, check for changes query) led to multiple consecutive error dialogs, which were irritating for our users. As these errors occurred randomly and would typically be resolved by the next poll, we decided to silence them altogether.
