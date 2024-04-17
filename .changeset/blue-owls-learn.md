---
"@comet/cms-admin": patch
---

Hide the "Dependents" tab in the DAM if the `DependenciesConfigProvider` is not configured

Previously, the tab was always shown, even if the feature wasn't configured. Though it didn't cause an error, the tab showed no valuable information.

Now, we hide the tab if no configuration is passed via the `DependenciesConfigProvider`.
