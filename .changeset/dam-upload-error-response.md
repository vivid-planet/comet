---
"@dextinity/cms-admin": patch
---

Show the correct error message when a DAM file upload is rejected by the API

Previously, rejected uploads (e.g., an image exceeding the maximum resolution) were treated as successful, resulting in a generic error like "Variable $id of required type ID! was not provided" instead of the specific validation message.

Replacing a file now also shows the HTTP status instead of a JSON parse error when the API responds with a non-JSON error.
