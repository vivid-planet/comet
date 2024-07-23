---
"@comet/cms-admin": major
"@comet/cms-api": major
"@comet/eslint-config": minor
"@comet/cms-site": minor
---

Use the Next.js Preview Mode for the site preview

The preview is entered by navigating to an API Route in the site, which has to be executed in a secured environment.
In the API Route the current scope is checked (and possibly stored), then the client is redirected to the preview.
