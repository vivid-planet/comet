---
"@comet/cli": minor
---

Always use main url for site url

The `url` property in the site configs is used for redirecting when the host does not match exactly. Redirecting to the preliminary domain does not make sense at all.
