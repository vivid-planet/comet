---
"@dextinity/mail-react": patch
---

Fix the full-width button overflowing its container in some webmail clients

A `MjmlButton` or `HtmlButton` with `fullWidth` set rendered wider than the content around it, reaching past the edge of the mail body.
