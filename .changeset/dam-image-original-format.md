---
"@dextinity/cms-api": minor
---

Allow requesting a DAM image in its original format

Add the optional `format:original` path segment after the `resize` segment of a DAM image URL, e.g. `/dam/images/…/resize:640:320/format:original/photo`.
With it, the API delivers the original format instead of choosing a modern format like WebP based on the `Accept` header.
Originals that aren't JPEG, PNG or GIF are delivered as JPEG.
