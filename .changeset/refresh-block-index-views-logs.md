---
"@comet/cms-api": patch
---

Add timing and outcome logs to the `refreshBlockIndexViews` command

The command now logs how long the refresh took and whether a refresh was actually performed or skipped because the block index views were still fresh enough.
