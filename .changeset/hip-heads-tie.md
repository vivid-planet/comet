---
"@comet/cms-api": patch
---

Fix `AzureOpenAiContentGenerationService` for newer GPT models

We still used the deprecated `max_tokens` that isn't supported anymore by newer models.
Replaced it with the newer `max_completion_tokens`.
