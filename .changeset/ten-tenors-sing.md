---
"@comet/cms-admin": patch
---

Update @Transform to avoid initializing new Date(null) for license input by treating null as undefined.
