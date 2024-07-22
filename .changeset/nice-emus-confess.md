---
"@comet/cms-api": minor
---

Loosen the filename slugification rules

When uploading a file to the DAM, the filename is automatically slugified.
Previously, the slugification used pretty strict rules without a good reason.

Now, the rules were loosened allowing uppercase characters and most special characters.
Also, slugify now uses the locale `en` instead of `de` for special character replacements.
