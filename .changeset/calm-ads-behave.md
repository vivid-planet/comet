---
"@comet/cms-api": patch
---

Don't replace a file if the new file is identical to the existing one in the DAM

This previously led to a bug where a file was deleted if it was replaced with the same file.
