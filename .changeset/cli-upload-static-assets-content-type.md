---
"@dextinity/cli": minor
---

Prepare files uploaded with `upload-static-assets` to be loaded by browsers directly from the storage

- Set the content type of stylesheets and scripts, which browsers refuse with the storage's default type `application/octet-stream`
- Add the `--s3-public-read` option to make the uploaded files publicly readable
