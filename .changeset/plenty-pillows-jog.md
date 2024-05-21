---
"@comet/admin": minor
---

Change `writeClipboardText`/`readClipboardText` clipboard fallback to in-memory

Using the local storage as a fallback caused issues when writing clipboard contents larger than 5MB.
Changing the fallback to in-memory resolves the issue.
