---
"@comet/cms-api": patch
---

The CometAuthGuards now only creates the `CurrentUser` just on a request-basis and skips when called in a fieldResolver (e.g. when `fieldResolverEnhancers` contains `guards`).
