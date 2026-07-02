---
"@comet/cms-api": patch
---

Load `openai` lazily in `AzureOpenAiContentGenerationService`

The `openai` client was statically imported, so importing anything from `@comet/cms-api` pulled it into memory even when the content-generation feature was disabled. It's now required lazily when a client is actually created, reducing the package's base memory footprint.
